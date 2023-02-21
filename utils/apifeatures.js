const { json } = require("express");

class Apifeatures{

    constructor(query,querystr){


        this.query=query,
        this.querystr=querystr
    }

    search(){
         const keyword=this.querystr.keyword ?{
            name:{
                $regex:this.querystr.keyword,
                $options:'i',
            }
         }:{}
        
         this.query=this.query.find({...keyword})
         return this
    }

     filter(){

         const querycopy={...this.querystr}
         console.log(  "sdddd",querycopy)
         
         //Removing some category

         const removefields=['keyword','page','limit']
         removefields.forEach(key=> delete querycopy[key])

         //price and raiting  filter means How much the price will change according to filter
       
       console.log(querycopy)
      let querstr=JSON.stringify(querycopy)
            querstr=querstr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)
            console.log(querstr)

        this.query.find(querycopy)  
        return this


     } 

     pagination(resultperpage){
        // here manually we give the result perpage


        const currentpage=Number(this.querystr.page) || 1;

         const skip=resultperpage *(currentpage-1)

         this.query=this.query.limit(resultperpage).skip(skip)
          return this
     }


}


module.exports=Apifeatures