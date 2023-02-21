const app= require('./index')

const dotenv=require('dotenv')
const db=require('./config/Data')

//config
dotenv.config()
//conect DBbase
db()
process.on("uncaughtException",(err)=>{
    console.log(`error,${err.message}`)
    console.log("shutdown")
    process.exit(1)
    
})




 const server=app.listen(process.env.PORT,()=>{


    console.log(`server is runnin on : ${process.env.PORT}`)
})



// Unhandel promise rejection 

process.on("unhandledRejection",err=>{

    console.log(`error,  ${err.message}`);
    console.log("Shutting down server")

    server.close(()=>{
        process.exit(1)  
    })
})



