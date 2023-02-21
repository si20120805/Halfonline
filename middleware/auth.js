const ErrorHandler = require("../utils/errorhandle");
const catchasyncerror = require("./catchasyncerror");
const jwt =require('jsonwebtoken')

const Usermodel = require('../models/usermodel')


exports.isauthonticated= catchasyncerror(async(req,res,next)=>{

////token verify for the entrance

    const {token}=req.cookies;
    if(!token){

        return next(new ErrorHandler("please login acess resources", 401))
    }
     const decodedata=jwt.verify(token, process.env.SECRET_KEY)
     req.user=await Usermodel.findById(decodedata.id)
     console.log('ddddddd',req.user.role)
    

     next()
     
})

//reactnodejs123

exports.autorizide=(...roles)=>{

    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){

            next(new ErrorHandler(`not autho ${req.user.role}`))
        }

        next()


    }



}



