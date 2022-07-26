import { Router } from 'express'
import { itemRepository } from '../om/item.js'
import { raw } from './output.js'

export const router = Router()

router.get('/insert-all-itens', async (req, res) => { 
    try {
        const items = JSON.parse(JSON.stringify(raw))
        const previous = await itemRepository.search().return.all()
        previous && await Promise.all(
            previous.map(async e => await itemRepository.remove(e.entityId))
        )
        const result =  await Promise.all(
            items.map(async e => await itemRepository.createAndSave(e))
        )
        console.log(result.length)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})


router.get('/all', async (req, res) => { 
    try { 
        const result = await itemRepository.search().return.all()
        res.send(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/search', async (req, res) => { 
    try {
        let text = req.query.text 
        const offset = 100
        const count = 10
        const result = await itemRepository.search()
        .where('outletName').matches(text)
        .or('restaurantName').matches(text)
        .or('metaName').matches(text)
        .or('metaDescription').matches(text) 
        .or('menuCategoriesName').matches(text)
        .or('mealTagName').contains(text)
        .or('tagName').contains(text).return.page(offset, count)
        res.send(result)
    } catch (error) {
        console.log(error)
    }
  })
 