
import { Entity, Schema } from 'redis-om'
import client from './client.js'

class Item extends Entity {}

/* create a Schema for Item */
const itemSchema = new Schema(Item, {
    outletName: {
        type: 'text', 
        sortable: true, 
        weight: 3,
        indexed: true
    }, 
    restaurantName: {
        type: 'text',
        weight: 4
    },
    metaName: {
        type: 'text', 
        weight: 2
    },
    metaDescription: {
        type: 'text',
        weight: 3
    },
    menuCategoriesName: {
        type: 'text',
        weight: 3
    },
    mealTagName: {
        type: 'string[]',
        weight: 4
    },
    itemTagName: {
        type: 'string[]',
        weight: 5
    },
    tagName: {
        type: 'string[]',
        weight: 2
    }
  })

/* use the client to create a Repository just for Item */
export const itemRepository = client.fetchRepository(itemSchema)

/* create the index for Item */
await itemRepository.createIndex()


