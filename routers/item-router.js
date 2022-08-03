import { Router } from 'express'
import client from '../om/client.js'
import { itemRepository } from '../om/item.js' 
import { Aggregation } from './aggregation/index.js'
import { fromArrayOfStringToJson, sortByDistance,   } from './helper/index.js'
import { raw } from './output.js'

export const router = Router()

router.get('/insert-all-itens', async (req, res) => { 
    try {
        let items = JSON.parse(JSON.stringify(raw))
        items = items.slice(0,2000);
        console.log(items[100])
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
 

  router.get('/distance', async (req, res) => { 
    const startTime = Date.now()
    try { 
        let text = req.query.text+"*"
        let lon = Number(req.query.lon)
        let lat = Number(req.query.lat)
        let skip = Number(req.query.skip) || 0
        let limit = Number(req.query.limit) || 10
        console.log(lon, lat) 
        let filterLocation = await itemRepository.search()
        .where('location')
        .inRadius(circle => circle.origin(lon, lat).radius(2000).meters).return.all()
        console.log("text search ",filterLocation.length)
        // filterLocation = sortByDistance(filterLocation, lon, lat)

        let textFilter = await itemRepository.search() 
        .where('outletName').matches(text)
        .or('restaurantName').matches(text)
        .or('hierarchy').matches(text)
        .or('metaName').matches(text)
        .or('metaDescription').matches(text) 
        .or('menuCategoriesName').matches(text)
        .or('mealTagName').contains(text)
        .or('tagName').contains(text)
        .return.all()
        console.log("text search ",textFilter.length)

        const locationIds = filterLocation.map(e => e.entityId)
        let result = textFilter.filter(e => locationIds.includes(e.entityId)).splice(skip,limit)
        console.log(result.length);
        result = sortByDistance(result, lon, lat)
        const distance = result.map(e => e.distance)
        console.log(distance);
        console.log(Date.now() - startTime)
        res.send(result)
    } catch (error) {
        console.log(error)
    }
  })


  router.get('/test', async (req, res)=>{
    try {
        let text = req.query.text+"*"
        let query = ['FT.SEARCH','item']
         
        const q = ['FT.AGGREGATE', 'item', `${text} @location:[90.4121358 23.7993865 2 km]`, "LOAD", "*", "APPLY", "geodistance(@location, 90.4121358, 23.7993865)", "AS", "dist", "SORTBY", 2, "@dist", "ASC", "LIMIT", 0, 5]
        
        console.log(q)
       const data =  await client.execute(q)
       //convert data to json
       console.log(data.length);
       res.send(fromArrayOfStringToJson(data))
    } catch (error) {
        console.log(error)
    }
  })

  

  router.get('/aggregate', async (req, res)=>{
    try {
        let { index, key, loadFields, offset, count } = req.query 
        const aggregate = new Aggregation()
        const query = aggregate.index(index).find(key).inRadius(90.4121358, 23.7993865, 5000, "m").load(loadFields).applyGeoDistance(90.4121358, 23.7993865, "dist").sortBy("dist", "ASC").limit(offset, count).build() 
        // const query = aggregate.index(index).find(key+"*").load(loadFields).applyGeoDistance(90.4121358, 23.7993865, "dist").sortBy("dist", "ASC").build() 
        console.log(query)
       const data =  await client.execute(query) 
       console.log(data.length);
       res.send(fromArrayOfStringToJson(data))
    } catch (error) {
        console.log(error)
    }
  })