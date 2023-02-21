const express=require('express');
const router=express.Router();

const {deleteorder,OrderCreation,getsingleorder,loginorderuser,getAllorder,updateorder}=require('../controllers/odercurd')
const { isauthonticated, autorizide } = require('../middleware/auth');



router.route('/order/new').post(isauthonticated,OrderCreation)

router.route('/order/me').get(isauthonticated,loginorderuser)
router.route('/order/:id').get(isauthonticated,getsingleorder)
//here we have to put the id pramenter below some time it will relocate to that router and this cause error 




// admin//

router.route('/admin/order').get(isauthonticated,autorizide('admin'),getAllorder)
router.route('/admin/order/:id').put(isauthonticated,autorizide('admin'),updateorder)
router.route('/admin/order/delete/:id').delete(isauthonticated,autorizide('admin'),deleteorder)







module.exports=router