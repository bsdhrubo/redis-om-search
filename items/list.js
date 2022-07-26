import randomSentence from 'random-sentence';
const text =()=> randomSentence({min: 4, max: 12})


export const generateItems =()=>{
    const list = [] 
    for(let i=0; i<100; i++){
        const data = {
            outletName: text(),
            restaurantName: text(),
            metaName: text(),
            metaDescription: text(),
            mealTagName: text(),
            itemTagName: text(),
            menuCategoriesName: text(),
            tagName: text()
        }
        list.push(data)
    }
    return list
}




