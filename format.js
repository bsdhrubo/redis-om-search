import * as fs from 'fs';
const raw = JSON.parse(
    await fs.readFileSync('./items.json', 'utf-8')
  );


const data = raw.map(e => {
    let itemTag = []
    if(e.itemTag.length > 0){
        e.itemTag.map(e => {
            itemTag.push(e.name)
        })
    }
    let mealTag = []
    if(e.mealTag.length > 0){
        e.mealTag.map(e => {
            mealTag.push(e.name)
        })
    }
    return {
        outletName: e.outlet.name,
        restaurantName: e.restaurant.name,
        metaName: e.meta.name,
        metaDescription: e.meta.description,
        menuCategoriesName: e.menuCategories[0].name,
        mealTagName: mealTag,
        itemTagName: itemTag,
        tagName: []
    }
})
console.log(data[0]);
 fs.writeFile('output.json', JSON.stringify(data), ()=>console.log)