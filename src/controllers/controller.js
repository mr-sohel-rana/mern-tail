const userModel = require("../models/userModel");
const fs=require('fs')
const fileType=require('file-type');
const {hashPassword, comparePassword} = require("../helper/hashpassword");
const { contentType } = require("mime-types");
const { EncodeToken } = require("../helper/tokenHelper");
const nodemailer=require('nodemailer')


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
const user = async (req, res) => {
    try {
     const { id } = req.params;
     const userData = await userModel.findById(id).select("-photo");
     
     if (!userData) {
         return res.status(400).json({ status: "failed", message: "user not found" });
     }
     
     return res.status(200).json({ status: "success", user: userData });
    } catch (e) {
     console.error(e); // Log error for debugging
     return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
 };
 
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
 const forgotPassword = async (req, res) => {


    // Extract email from the request body
    const { email } = req.body;
 try {
        // Trim and process the email
        const emailTrimmed = email.trim().toLowerCase();  // Normalize email
 

        // Generate a 6-digit OTP
        const generateOTP = Math.floor(100000 + Math.random() * 900000);
  

        // Check if the user exists in the database
        let user = await userModel.findOne({ email: emailTrimmed });
        if (!user) {
            console.log(`No user found with email: ${emailTrimmed}`);
            return res.status(400).json({ message: "User not found" });
        }

        // Set up Nodemailer transporter
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,  // false means TLS
            auth: {
                user: "md.sohelrana.ice@gmail.com",  // Use your Gmail address here
                pass: "qwhu jmwb wqzh gnbf"  // Use your Gmail app password here
            }
        });

        // Send OTP email
        const info = await transporter.sendMail({
            from: "md.sohelrana.ice@gmail.com",
            to: emailTrimmed,
            subject: "Verify Your Email",
            html: `<b><i>Your OTP is: ${generateOTP}</i></b>`
        });


        // Update OTP in the database for the user
        await userModel.updateOne({ email: emailTrimmed }, { otp: generateOTP });

        // Send success response
        res.status(200).json({ message: "OTP has been sent successfully" });

    } catch (e) {
        res.status(500).json({ status: "failed", message: "Internal Server Error", error: e.message });
    }
};
const otpVerification = async (req, res) => {
    const { otp, email } = req.body;  // Get OTP and email from request body
  
    // Validate input: Check if both OTP and email are provided
    if (!otp || !email) {
      return res.status(400).json({ message: "OTP and email are required" });
    }
  
    try {
      // Check if user exists and matches OTP and email
      const user = await userModel.findOne({ otp, email });
  
      if (!user) {
        return res.status(404).json({ message: "Invalid OTP or email" });
      }
  
      // Optionally, add logic here to check if the OTP is expired (if you store expiration time)
  
      // If OTP is correct, respond with success
      res.status(200).json({ status: "success", message: "OTP verified successfully" });
    } catch (e) {
      // Handle any errors that may occur
      console.error("Error during OTP verification:", e);
      res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
  };
  
  const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    // Validate if the required fields are provided
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }
  
    try {
      console.log('Reset Password Request Data:', { email, otp, newPassword });
  
      // Find the user based on the email and OTP
      const user = await userModel.findOne({ email, otp });
  
      if (!user) {
        console.log(`User not found with email: ${email} or OTP: ${otp}`);
        return res.status(404).json({ message: "Invalid email or OTP." });
      }
  
      // Hash the new password before saving
      const hashedPassword = await hashPassword(newPassword);
      if (!hashedPassword) {
        console.log("Error in hashing password.");
        return res.status(500).json({ message: "Error in password hashing." });
      }
  
      // Update the user's password in the database
      user.password = hashedPassword;
      user.otp = 0; // Optionally reset the OTP to prevent reuse
  
      await user.save();
  
      console.log("Password reset successful.");
      // Return success response
      res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
      console.error("Error resetting password:", error.message); // Log only the error message
      res.status(500).json({ message: "Internal server error.", error: error.message });
    }
  };
  
module.exports={
    read,Register,login,UpdateUser,user,users,photo,deleteUser,forgotPassword,otpVerification,resetPassword
}
