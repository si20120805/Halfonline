const errorhandler = require('../utils/errorhandle')


module.exports = (err, req, res, next) => {
    console.log(err)

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error"

    //Wrong mongodb id error
    if (err.name === 'CastError') {

        const message = `Resoures not found invalid:${err.path} `
        err = new errorhandler(message, 400)
    }


    //Mongose duplicate error
    if (err.code === 11000) {
        const msg = `duplicate ${Object.keys(err.keyValue)} Entered`
        console.log(err.keyValue)
        err = new errorhandler(msg, 400)


    }

    // jwt errr

    if (err.name === 'jsonWebTokenError') {

        const message = `json web token error `
        err = new errorhandler(message, 400)
    }

    // json expiredata

    if (err.name === 'TokenExpiredError') {

        const message = `token expired Errrr  `
        err = new errorhandler(message, 400)
    }



    res.status(err.statusCode).json({
        sucess: 'falsessssssssss',
        msg: err.message,
        Code: err.statusCode
    })

}