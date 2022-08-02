import * as fs from 'fs';
import { hierarchy } from './hierarchy.js';
import { outletLocation } from './outlets.js';
import { raw } from './output.js';
// const raw = JSON.parse(
//     await fs.readFileSync('./items.json', 'utf-8')
//   );


// const data = raw.map(e => {
//     let itemTag = []
//     if(e.itemTag.length > 0){
//         e.itemTag.map(e => {
//             itemTag.push(e.name)
//         })
//     }
//     let mealTag = []
//     if(e.mealTag.length > 0){
//         e.mealTag.map(e => {
//             mealTag.push(e.name)
//         })
//     }
//     return {
//         outletName: e.outlet.name,
//         restaurantName: e.restaurant.name,
//         metaName: e.meta.name,
//         metaDescription: e.meta.description,
//         menuCategoriesName: e.menuCategories[0].name,
//         mealTagName: mealTag,
//         itemTagName: itemTag,
//         tagName: []
//     }
// })
// console.log(data[0]);
//  fs.writeFile('output.json', JSON.stringify(data), ()=>console.log)

const hier = JSON.parse(JSON.stringify(hierarchy))
let prev = JSON.parse(JSON.stringify(raw))
const loc = JSON.parse(JSON.stringify(outletLocation))

console.log(hier[0])


for(let i=0; i<loc.length; i++){ 
    console.log(loc[i])
    prev[i].hierarchy = hier[i].hierarchy
    prev[i].location = { longitude: loc[i]?.location?.coordinates[0], latitude: loc[i]?.location?.coordinates[1] }
}

for(let i=0; i<loc.length; i++){  
    prev[i].hierarchy = hier[i].hierarchy
    prev[i].location = { longitude: loc[i]?.location?.coordinates[0] || loc[0]?.location?.coordinates[0], latitude: loc[i]?.location?.coordinates[1] || loc[0]?.location?.coordinates[1]  }
     
}
prev = prev.slice(0,2000)
console.log(prev.length)
fs.writeFile('output2.js', JSON.stringify(prev), ()=>console.log)