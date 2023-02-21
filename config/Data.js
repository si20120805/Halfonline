const mongoose=require('mongoose')

const connect=()=>{
    mongoose.set('strictQuery', false);



    mongoose.connect(process.env.DB_URL,{useNewUrlParser:true, useUnifiedTopology:true}).then((data)=>{

        console.log(`Sucess connection,${data.connection.host}`)
        
        })
}

module.exports=connect