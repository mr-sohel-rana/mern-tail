const  express=require("express");
const  router=express.Router()
const controller=require("../controllers/controller")
const formid=require('express-formidable')
const {requireSignIn,isAdmin}=require('../middleware/middleware')

router.get("/read",controller.read)

router.post('/register',formid(),controller.Register)
router.post('/login',controller.login)
router.put('/updateUser/:id',requireSignIn,formid(),controller.UpdateUser)
router.get('/user/:id',requireSignIn,controller.user)
router.get('/users',requireSignIn,isAdmin,controller.users)
router.post('/forgot',controller.forgotPassword)
router.post('/otp-varify',controller.otpVerification)
router.put('/reset-password',controller.resetPassword)

router.get('/photo/:id',requireSignIn,controller.photo)
router.delete('/deleteUser/:id',requireSignIn,controller.deleteUser)

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).json({ ok: true });
});

router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).json({ ok: true });
})



module.exports=router;
