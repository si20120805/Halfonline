const order=require('../models/orderapimodel')

const Product = require('../models/productmodel')
const ErrorHandler = require('../utils/errorhandle')

const catchasync = require('../middleware/catchasyncerror')





//Create new Order 
exports.OrderCreation=catchasync(async (req,res,next)=>{

    const{
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,



    }=req.body

    const orderr= await order.create({
        shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id


    })
    res.status(200).json({sucess:true,orderr})
})


//Get single Order  ADMIN details  like we see the sigle order by clicking particual order 

exports.getsingleorder=catchasync(async (req,res,next)=>{

    const orders=await  order.findById(req.params.id).populate("user" ,"name email")


    if(!orders){
        return next(new ErrorHandler('product not found ', 404))

    }
    res.status(200).json({sucess:true,orders})
})

//get login user see order 

exports.loginorderuser=catchasync(async (req,res,next)=>{

    const orders=await order.find({user:req.user._id})


   
    res.status(200).json({sucess:true,orders})
})

//get all order admin 

// exports.getAllorder=catchasync(async (req,res,next)=>{
//     const orders=await order.find()

//     let totalamount=0;
//     orders.forEach((order) => {
//         totalamount+=order.totalPrice;

//     });
//     res.status(200).json({sucess:true,totalamount,orders})
// })


//get all order admin  to check the adim all order he get





exports.getAllorder=catchasync(async (req,res,next)=>{
    const orders= await order.find()

    let totalamount=0;
    orders.forEach((order)=>{
        totalamount+=order.totalPrice;

    });
    res.status(200).json({sucess:true,orders,totalamount})
})


//update the Status of the order 

exports.updateorder=catchasync(async (req,res,next)=>{
    const orders=await order.findById(req.params.id)

   if (orders.status==="Delivered"){
    return next(new ErrorHandler("You have delivered the order ",404))
   }
    

    orders.orderItems.forEach( async(o)=>{
       await updateStock(o.product,o.quantity)
    })
    orders.orderStatus=req.body.status

    if(req.body.status==="Delivered"){
        orders.deliveredar=Date.now()
    }

    await orders.save({validateBeforeSave:false})
    

       
    res.status(200).json({sucess:true,orders})
})

async function updateStock(id,quantity){

    console.log('fffffffffff',id, quantity)

    const product =await Product.findById(id);
    product.stock  -= quantity
    product.save({validateBeforeSave:false})
   




}
// delete order //

exports.deleteorder= catchasync(async (req,res,next)=>{

    const orders =await order.findById(req.params.id);

    if(!orders){

        next (new ErrorHandler('not found any order',404 ))
    }
    await orders.remove()


    res.status(200).json({sucess:true,
    })

})







