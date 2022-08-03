// const q = ['FT.AGGREGATE', 'item', `${text} @location:[90.4121358 23.7993865 2 km]`, "LOAD", "*", "APPLY", "geodistance(@location, 90.4121358, 23.7993865)", "AS", "dist", "SORTBY", 2, "@dist", "ASC", "LIMIT", 0, 5]

export class Aggregation{
    query = ['FT.AGGREGATE']
    index(index_name){
        this.query.push(index_name)
        return this;
    }
    find(query_string){
        this.query.push(query_string)
        this.query.push('LOAD','*')
        return this;
    }
    inRadius(lon=0.0, lat=0.0, distance=1, unit="km"){
        this.query[2] = this.query[2]+` @location:[${lon} ${lat} ${distance} ${unit}]`;
        return this;
    }
    applyExpr(expr="functionName", field, as="newField"){
        this.query.push('APPLY');
        this.query.push(`${expr}(@${field})`); 
        return this.returnApply(as)
    }
    applyGeoDistance(lon=0.0, lat=0.0, as="distance"){
        this.query.push('APPLY'); 
        this.query.push(`geodistance(@location, ${lon}, ${lat})`);
        return this.returnApply(as)
    }
    returnApply(as){
        this.query.push("AS");
        this.query.push(`${as}`);
        return this;
    }
    load(fields){ 
        console.log(fields)
        const idx = this.query.indexOf('LOAD') 
        if(idx>-1 && fields?.length > 0){
            console.log(fields)
            fields = fields.split(',');
            this.query[idx+1] = fields.length;
            this.query.push(...fields)
        }
        return this;
    } 
    sortBy(field, order="ASC"){
        this.query.push("SORTBY", 2, `@${field}`, `${order}`)
        return this;
    }  
    limit(offset=0, count=100){
        this.query.push("LIMIT", `${offset}`, `${count}`)
        return this;
    }  
    build(){
        return this.query;
    }

}