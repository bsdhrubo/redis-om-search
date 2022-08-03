import { Router } from 'express'
import client from '../om/client.js'
import { itemRepository } from '../om/item.js' 
import { Aggregation } from './aggregation/index.js'
import { fromArrayOfStringToJson, sortByDistance,   } from './helper/index.js'
import { raw } from './json-data.js'

export const router = Router()

router.get('/insert-all-itens', async (req, res) => { 
    try {
        let items = JSON.parse(JSON.stringify(raw))
        items = items.slice(0,2000); 
        const previous = await itemRepository.search().return.all()
        previous && await Promise.all(
            previous.map(async e => await itemRepository.remove(e.entityId))
        )
        const result =  await Promise.all(
            items.map(async e => await itemRepository.createAndSave(e))
        ) 
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
        let text = req.query.text+"*"
        console.log(text)
        const offset = 100
        const count = 10
        const result = await itemRepository.search()
        .where('outletName').matches(text)
        .or('restaurantName').matches(text)
        .or('hierarchy').matches(text)
        .or('metaName').matches(text)
        .or('metaDescription').matches(text) 
        .or('menuCategoriesName').matches(text)
        .or('mealTagName').contains(text)
        .or('tagName').contains(text)
        .return.page(offset, count)
        res.send(result)
    } catch (error) {
        console.log(error)
    }
  })
 

router.get('/aggregate', async (req, res)=>{
    try {
        let { index, key, loadFields, offset, count } = req.query 
        const aggregate = new Aggregation()
        const query = aggregate.index(index).find(key).inRadius(90.4121358, 23.7993865, 5000, "m").load(loadFields).applyGeoDistance(90.4121358, 23.7993865, "dist").sortBy("dist", "ASC").limit(offset, count).build()
        const data =  await client.execute(query)  
        res.send(fromArrayOfStringToJson(data))
    } catch (error) {
        console.log(error) 
    }
})