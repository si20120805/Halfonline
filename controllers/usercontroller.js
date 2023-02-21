const Usermodel = require('../models/usermodel')


const catchasyncerror = require('../middleware/catchasyncerror')
const { TokenExpiredError } = require('jsonwebtoken')
const errclass = require('../utils/errorhandle')

const saveres = require('../utils/jwttoken')
const sendmail = require('../utils/sendemail')

const crypto = require('crypto')


//Register user 

exports.registeruser = catchasyncerror(async (req, res, next) => {

    const { name, email, password } = req.body

    const user = await Usermodel.create({
        name, email, password,
        avtar: {
            public_id: 'thisgr',
            url: 'teewrttt'
        }



    })
    saveres(user, 201, res)

})



//login

exports.login = catchasyncerror(async (req, res, next) => {
    const { email, password } = req.body;

    //check weather empty or not 
    if (!email || !password) {

        return next(new errclass("please enterdetails", 400))
    }
    const user = await Usermodel.findOne({ email: email }).select('+password')


    if (!user) {

        return next(new errclass('invalid user name and password', 401))
    }
    const isPasswordMatch = user.comparedPassword(password)

    if (!isPasswordMatch) {
        return next(new errclass('invalid user name and password', 401))
    }


    saveres(user, 201, res)


})


//Logout

exports.logout = catchasyncerror(async (req, res, next) => {

    res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true })


    res.status(200).json({ sucess: true, message: 'logout' })

})


exports.forgetpassword = catchasyncerror(async (req, res, next) => {


    const user = await Usermodel.findOne({ email: req.body.email })

    if (!user) {
        return next(new errclass("user not found", 404))
    }

    //get reset token 
    const resetoken = user.tokenreset()
    await user.save({ validateBeforeSave: false })
    const link = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetoken}`

    const message = `Your ${link}`
    try {




        await sendmail({


            email: user.email,
            subject: "siddharth Ecommerce",
            message


        })
        res.status(200).json({ sucess: true, message: `Email sent to ${user.email}` })

    } catch (error) {

        user.resettoken = undefined;
        user.resetpasswordtoken = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new errclass(error.message, 500))


    }

})

exports.resetpassword = catchasyncerror(async (req, res, next) => {

    //createing hash
    const resetpasswordtoken = crypto.
        createHash("sha256").
        update(req.params.rt).
        digest('hex')

    const user = await Usermodel.findOne({ resetpasswordtoken: resetpasswordtoken, resepasswworddate: { $gt: Date.now() } })
    console.log(user)


    if (!user) {

        return next(new errclass('No user found ', 401))
    }

    if (req.body.password !== req.body.confirmpassword) {

        return next(new errclass('No match  password ', 401))
    }

    user.password = req.body.password
    user.resepasswworddate = undefined;
    user.resetpasswordtoken = undefined;

    await user.save()

    saveres(user, 200, res)



})

//get user details 
exports.getuerdetails = catchasyncerror(async (req, res, next) => {

    const user = await Usermodel.findById(req.user.id)
    res.status(200).json({
        sucess: true, user
    });
})

//update user 

exports.updateuserr = catchasyncerror(async (req, res, next) => {

    const user = await Usermodel.findById(req.user.id).select("+password")

    const isPasswordMatch = user.comparedPassword(req.body.oldpassword)
    //if we are not giving the old password then the will not able to search the bcrpty and showing passwordfield required 

    if (!isPasswordMatch) {
        return next(new errclass('Old password shuld be same ', 401))
    }
    if (req.body.newpassword !== req.body.confirmpassword) {
        return next(new errclass('Password is not Match ', 401))

    }
    user.password = req.body.newpassword

    await user.save()


    saveres(user, 200, res)
})



//Update profile 
exports.updateprofile = catchasyncerror(async (req, res, next) => {
 //if we are not giving the old password then the will not able to search the bcrpty and showing passwordfield required 

    const newuserdata = {
        name: req.body.name,
        email: req.body.email
    }

    //    we will add cloud after 
    const user = await Usermodel.findByIdAndUpdate(req.user.id, newuserdata, {
        new: true, runValidators: true, useFindAndModify: false
    })

    saveres(user, 200, res)
})

//Get user Admin see the Users

exports.exportgetalluser=catchasyncerror(async(req,res,next)=>{


    const user=  await Usermodel.find();
    res.status(200).json({sucess:true,user})
})

exports.exportgetsingleuser=catchasyncerror(async(req,res,next)=>{

    


    const user=  await Usermodel.findById(req.params.id);
    if(!user){

        return (new errclass(`no user found ${req,params.id}`,404))
    }
    res.status(200).json({sucess:true,user})
})



// update user admin doing

exports.updateprofilerole = catchasyncerror(async (req, res, next) => {
    //if we are not giving the old password then the will not able to search the bcrpty and showing passwordfield required 
   
       const newuserdata = {
           name: req.body.name,
           email: req.body.email,
           role:req.body.role
       }
   
       //    we will add cloud after 
       const user = await Usermodel.findByIdAndUpdate(req.params.id, newuserdata, {
           new: true, runValidators: true, useFindAndModify: false
       })
   
       saveres(user, 200, res)
   })

//    delete user by dmin//

exports.deleteuserbyadmin=catchasyncerror(async(req,res,next)=>{


    const user =await Usermodel.findById(req.params.id)
    if(!user){

        return (new errclass(`use is no t ${user}`),404)
    }

    await user.remove()
    res.status(200).json({sucess:true,})
})






