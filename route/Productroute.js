const express=require('express')

const router=express.Router();
const {deletereview,getallreviews,allproduct,createproduct,updateproducts,deleteproduct,getsingleproduct,createproductreview}= require('../controllers/Productcontroller');
const { isauthonticated, autorizide } = require('../middleware/auth');


//Router
router.route('/product').get( allproduct);
router.route('/product/admin/new').post( isauthonticated,autorizide('admin'),isauthonticated,autorizide('user'),createproduct)
router.route('/product/admin/:id').put(isauthonticated,autorizide('user'),updateproducts)
router.route('/product/admin/:id').delete(isauthonticated,autorizide('user'),deleteproduct)
router.route('/product/:id').get(getsingleproduct)
router.route('/rating').post(isauthonticated,createproductreview)
// isauthonticated,autorizide('admin'),

router.route('/reviews').get(getallreviews)
router.route('/deleted').delete(isauthonticated,deletereview)






module.exports=router;