const express=require('express')
const app=express();
app.use(express.json())
const cookieparser=require('cookie-parser')
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));



const product=require('./route/Productroute')
const order=require('./route/orderroute')

const user=require('./route/userroute')

const errmiddleware=require('./middleware/erro')
app.use(cookieparser())
app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)

//for middle ware we have to use this 
app.use(errmiddleware)





module.exports=app;



