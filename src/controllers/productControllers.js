const Product = require("../models/productModel");
 

const CreateProduct=async(req,res)=>{
   try{

    const {name,description,price,category,quantity,shipping}=req.body;
    const files=req.files;
    const photos=[];
    if(files.photo1) photos.push(files.photo1[0].filename)
    if(files.photo2) photos.push(files.photo2[0].filename)
    if(files.photo3) photos.push(files.photo3[0].filename)
    if(files.photo4) photos.push(files.photo4[0].filename)
    if(files.photo5) photos.push(files.photo5[0].filename)

      const product=new Product({
        name,description,price,category,quantity,shipping,photos
      });
await product.save();
res.status(201).json({status:"success",product:product})
   }catch(e){
    res.status(500).json({status:"failed",message:"server error"})
   }
}
const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, quantity, shipping } = req.body;
    const files = req.files;

    let product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ status: "failed", message: "Product not found" });
    }

    // Ensure photos array exists
    let photos = product.photos || [];

    // Update photos if new images are uploaded
    if (files.photo1) photos[0] = files.photo1[0].filename;
    if (files.photo2) photos[1] = files.photo2[0].filename;
    if (files.photo3) photos[2] = files.photo3[0].filename;
    if (files.photo4) photos[3] = files.photo4[0].filename;
    if (files.photo5) photos[4] = files.photo5[0].filename;

    // Update product
    product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, quantity, shipping, photos },
      { new: true }
    );

    res.status(200).json({ status: "success", product });
  } catch (e) {
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};
const deleteProduct=async(req,res)=>{
 try{
  const {id}=req.params;
  const result=await Product.findByIdAndDelete(id);
  if(!result){
    res.status(400).json({ status: "failed", message: "product not found" });
  }
  res.status(200).json({ status: "success", result:result });
 } catch (e) {
  res.status(500).json({ status: "failed", message: "Server error" });
}
}

const product=async(req,res)=>{
 try{
  const {id}=req.params;
  const product=await Product.findById(id);
  if(!product){
    res.status(400).json({ status: "failed", message: "product not found" });
  }
  res.status(200).json({ status: "success", product:product });
 }catch (e) {
  res.status(500).json({ status: "failed", message: "Server error" });
}

}
const allProduct=async(req,res)=>{
try{
  const products=await Product.find({}).populate('category',"categoryName -_id")
if(!products){
  res.status(400).json({ status: "failed", message: "product not found" });
}
res.status(200).json({ status: "success", product:products });
}catch (e) {
  res.status(500).json({ status: "failed", message: "Server error" });
}
}
module.exports={
  CreateProduct,UpdateProduct,deleteProduct,product,allProduct
}