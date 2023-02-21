const { options } = require("../route/userroute")

const sendtoken=(user,statuscode,res)=>{

  const token = user.getJWT()

//options for cookies 
const option ={

    expire:new Date(Date.now()+ process.env.COOKIE_EXPIRE*24*60*60*1000),
    httpOnly:true,

}

//here we are putting the cookie in the server
res.status(statuscode).cookie("token",token,option).json({sucess:true,token,user})

}

module.exports= sendtoken;