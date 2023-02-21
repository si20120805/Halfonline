const Product = require('../models/productmodel')
const ErrorHandler = require('../utils/errorhandle')

const catchasync = require('../middleware/catchasyncerror')
const Apifeatures = require('../utils/apifeatures')




//Create Product--admin

exports.createproduct = catchasync(async (req, res, next) => {
    // console.log(req.body.user)
    //here we are ObjectId to refrence the other iD
    req.body.user = req.user.id;
    const product = await Product.create(req.body)
    res.status(201).json({
        sucess: true,
        product
    })


})


// Admin--view all product

exports.allproduct = catchasync(async (req, res) => {

    const resultperpage = 8;
    const producCount= await Product.countDocuments()
    const apifeature = new Apifeatures(Product.find(), req.query).search().filter().pagination(resultperpage)
    
    const products = await apifeature.query
    res.status(200).json({ msg: 'Sucesssssss', products,producCount,resultperpage})



})

// Admin--update

exports.updateproducts = catchasync(async (req, res, next) => {

    let product = Product.findById(req.params.id);
    console.log(product)
    if (!product) {

        return next(new ErrorHandler('product not found', 500))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    })
    res.status(200).json({ sucess: true, product })


})

exports.deleteproduct = catchasync(async (req, res, next) => {

    const product = Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('product not found', 500))
    }

    await product.remove()

    res.status(200).json({ sucess: true, msg: 'sucess Deleted' })
})

//add to cart the product--------
exports.getsingleproduct = catchasync(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('product not found', 406))
    }
    res.status(200).json({ sucess: true, product })

})


// Create new review and updatae 

exports.createproductreview = catchasync(async (req, res, next) => {


    const { rating, comment, productID } = req.body
    console.log('eeeeeeeeeee', req.body)
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating), comment, productID

    }
    
    const product = await Product.findById(productID);
    const isReviewed = product.reviews.find((rev) => {
        rev.user.toString() === req.user._id.toString()
    })
    if (isReviewed) {
        product.reviews.forEach(element => {
            if (element.user.toString() === req.user._id.toString())
                element.rating = rating,
                    element.comment = comment

        });



    } else {
        product.reviews.push(review)
        product.noofRewiews = product.reviews.length


    }
    let avg = 0
    product.reviews.forEach(rev => { avg += rev.rating })

    product.ratings = avg / product.reviews.length
    await product.save({ validateBeforeSave: false })


    res.status(200).json({ sucess: true })

})


//Get all reviews
exports.getallreviews = catchasync(async (req, res, next) => {

    const product = await Product.findById(req.query.id)

    if (!product) {
        return next(new ErrorHandler('product not found ', 404))
    }
    res.status(200).json({ sucess: true, review: product.reviews })
})


//Delete  look long time to bug fix
exports.deletereview = catchasync(async (req, res, next) => {


    const product = await Product.findById(req.query.productID)

    if (!product) {
        return next(new ErrorHandler('product not found ', 404))
    }
    const reviews = product.reviews.filter(rev =>  rev._id.toString() !== req.query.id.toString() )

    let avg = 0
    reviews.forEach((rev) => { avg += rev.rating })

    const rating = avg / reviews.length;


    const noofRewiews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productID, { reviews, rating, noofRewiews }, {
        new: true, runValidators: true, useFindAndModify: false
    })

    res.status(200).json({ sucess: true, review: product.reviews })
})




