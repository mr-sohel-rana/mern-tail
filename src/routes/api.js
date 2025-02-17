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

router.get('/photo/:id',requireSignIn,controller.photo)
router.delete('/deleteUser/:id',requireSignIn,controller.deleteUser)



module.exports=router;
