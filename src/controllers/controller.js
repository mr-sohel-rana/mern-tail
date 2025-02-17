const userModel = require("../models/userModel");
const fs=require('fs')
const fileType=require('file-type');
const {hashPassword, comparePassword} = require("../helper/hashpassword");
const { contentType } = require("mime-types");
const { EncodeToken } = require("../helper/tokenHelper");


const read=(req,res)=>{
    res.status(200).json({status:"succes",data:"success"})
}


const Register=async(req,res)=>{
   try{
    const {name,email,password}=req.fields;
    const {photo}=req.files;

    if(!photo){
        return res.status(400).json({status:"failed",message:"photo is required"})
    }
    
    if(await userModel.findOne({email})){
        return res.status(400).json({status:"failed",message:"Email is already register"});
    }

    const photoBuffer=fs.readFileSync(photo.path);
    const type=await fileType.fromBuffer(photoBuffer);
    if(!type){
        return res.status(400).json({status:"failed",message:"invalid file type"});
    }

    const hashedPassword = await hashPassword(password);
const user= new userModel({
    name,email,password:hashedPassword,photo:{
        data:photoBuffer,
        contentType:type.mime
    }
});
await user.save();


    res.status(200).json({status:"succes",user:user})
   }catch(e){
    res.status(500).json({status:"failed",error:e})
   }
}

// Loging
const login=async(req,res)=>{
    console.log(req.body);
try{
    
    const {email,password}=req.body;

    if(!email||!password){
        return res.status(400).json({status:"failed",message:"email password required"});
    }

    const user=await userModel.findOne({email}).select("-photo");

    if(!user){
        return res.status(400).json({status:"failed",message:"user not found"});
    }

    const isMatch=await comparePassword(password,user.password);
    if(!isMatch){
        return res.status(400).json({status:"failed",message:"invalid  passeord or email"});
    }

    const token= EncodeToken(user._id,user.name)

    //set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use this to conditionally set 'secure' flag
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
    });
// set headers
res.status(200).header('Authorization',`Bearer${token}`).json({status:"success",user:user,token:token})

}catch(e){
    console.error(e); // Log error for debugging
    res.status(500).json({ status: "failed", message: "Internal Server Error" });
}
}

//update users

const UpdateUser=async(req,res)=>{
    try{
        const {id}=req.params;
    const {name,email}=req.fields;
    const {photo}=req.files;
    let updates={name ,email};
    let photoBuffer,type;
    if(photo){
        photoBuffer=fs.readFileSync(photo.path)
         type =await fileType.fromBuffer(photoBuffer)
    }
    if(!type){
        return res.status(400).json({status:"failed",message:"invalid file type"});
    }
    updates.photo={
        data:photoBuffer,
        contentType:type.mime
    };
    const user=await userModel.findByIdAndUpdate(id,updates,{
        new:true,runValidators:true
    })
    
    if(!user){
        return res.status(400).json({status:"failed",message:"user not found"});
    }
    res.status(200).json({status:"success",user:user})
    }catch(e){
        console.error(e); // Log error for debugging
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}
const user=async(req,res)=>{
   try{
    const {id}=req.params;
    const user=await userModel.findById(id).select("-photo");
    if(!user){
        res.status(400).json({status:"failed",message:"user not found"})
    }
    res.status(200).json({status:"success",user:user})
   }catch(e){
    console.error(e); // Log error for debugging
    res.status(500).json({ status: "failed", message: "Internal Server Error" });
}

}
const photo=async(req,res)=>{
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: "failed", message: "User ID is required" });
    }
  
    try {
      const user = await userModel.findById(id).select('photo');
      if (user?.photo?.data) {
        res.set('Content-Type', user.photo.contentType);
        return res.status(200).send(user.photo.data);
      }
  
      res.status(404).json({ status: "failed", message: "User photo not found" });
    } catch (e) {
      console.error("Error fetching user photo:", e);
      res.status(500).json({ status: "failed", error: e.message });
    }
 
 }
const users=async(req,res)=>{
    try{
     
     const users=await userModel.find({}).select("-photo");
     if(!users){
         res.status(400).json({status:"failed",message:"user not found"})
     }
     res.status(200).json({status:"success",users:users})
    }catch(e){
     console.error(e); // Log error for debugging
     res.status(500).json({ status: "failed", message: "Internal Server Error" });
 }
 
 }
 
 const deleteUser=async(req,res)=>{
    try{
     const {id}=req.params;
     const user=await userModel.findByIdAndDelete(id);
     if(!user){
         res.status(400).json({status:"failed",message:"user not found"})
     }
     res.status(200).json({status:"success",user:user})
    }catch(e){
     console.error(e); // Log error for debugging
     res.status(500).json({ status: "failed", message: "Internal Server Error" });
 }
 
 }
module.exports={
    read,Register,login,UpdateUser,user,users,photo,deleteUser
}
