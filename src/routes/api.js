const  express=require("express");
const router=express.Router()
const controller=require("../controllers/controller")

router.get("/read",controller.read)


module.exports=router;
