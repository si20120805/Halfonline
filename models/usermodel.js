const { default: mongoose } = require('mongoose')
const moongose = require('mongoose')
const validator = require('validator')
const crypto=require('crypto')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')
const userSchema = new moongose.Schema({

    name: {
        type: String,
        required: [true, 'plz enter valid name'],
        maxLength: [30, 'cant exceed more'],
        minLength: [4, 'cant less than that']
    },
    email: {
        type: String,
        required: [true, 'enter valid string'],
        unique: true,
        validate: [validator.isEmail, 'plz enter valid email']
    },
    password: {
        type: String,
        required: [true, 'please enter the passworddddd'],
        minLength: [8, 'passwod contain more than 8'],
        select: false

    },
    avtar: {
        public_id: {
            type: String,
            required: true
        }, url: {
            type: String,
            required: true
        }
    },

    role: {
        type: String,
        default: 'user'
    },
    resetpasswordtoken: String,
    resepasswworddate: Date
})
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next()

    }
    this.password = await bcrypt.hash(this.password, 10)
})

    // jwt token
    userSchema.methods.getJWT =  function () {
        return  jwt.sign({ id: this._id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE })
    }
    
    //password cheking
    userSchema.methods.comparedPassword = async function (pass) {
    
        return await bcrypt.compare(pass, this.password)
    
    }

    //Resetpassword

   

    userSchema.methods.tokenreset=function(){
    const resettoken=crypto.randomBytes(20).toString("hex")
    // const tokencrypto=crypto.createHash("sha256").update(token).digest('hex')
    this.resetpasswordtoken=crypto.createHash("sha256").update(resettoken).digest('hex')

    this.resepasswworddate=Date.now()+15*60*1000

    return resettoken
    
    }

    








module.exports = mongoose.model("User", userSchema)