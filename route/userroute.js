const express=require('express')

const router=express.Router();

const {registeruser,login,logout,
    forgetpassword,resetpassword,getuerdetails,updateuserr,
    updateprofile,exportgetalluser,exportgetsingleuser,deleteuserbyadmin,updateprofilerole
}=require('../controllers/usercontroller');
// const { logout } = require('../middleware/auth');
const { isauthonticated, autorizide } = require('../middleware/auth');



router.route('/register').post(registeruser)
router.route('/login').post(login);

router.route('/logout').get(logout)

router.route('/forget').post(forgetpassword)
router.route('/reset/:rt').put(resetpassword)

router.route('/me').get( isauthonticated, getuerdetails)
router.route('/updatepass').put(isauthonticated,updateuserr)
router.route("/updateprofile").put(isauthonticated, updateprofile)

//Admin dash seable 
router.route('/admin/user').get(isauthonticated,autorizide("admin"),exportgetalluser)
router.route('/admin/user/:id').get(isauthonticated,autorizide("admin"),exportgetsingleuser)
router.route('/admin/user/update/:id').put(isauthonticated,autorizide("admin"),updateprofilerole).delete(isauthonticated,autorizide("admin"),deleteuserbyadmin)



module.exports=router