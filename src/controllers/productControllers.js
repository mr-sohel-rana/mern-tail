const Product = require("../models/productModel");
const userModel = require("../models/userModel");
const orderModel=require('../models/OrderModel');
const OrderModel = require("../models/OrderModel");
 

const CreateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;
    const files = req.files;

    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    console.log("Files received:", files); // Debugging line

    const photos = [];
    if (files.photo1) photos.push(files.photo1[0].filename);
    if (files.photo2) photos.push(files.photo2[0].filename);
    if (files.photo3) photos.push(files.photo3[0].filename);
    if (files.photo4) photos.push(files.photo4[0].filename);
    if (files.photo5) photos.push(files.photo5[0].filename);

    const product = new Product({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      photos
    });

    await product.save();
    res.status(201).json({ status: "success", product });
  } catch (e) {
    console.error("Error creating product:", e); // Log the error details
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};


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
const checkout = async (req, res) => {
  try {
    console.log(req.body); // Log the incoming request body to check if 'buyer' is correct

    const { fullName, phone, email, address, city, state, zip, paymentMethod, buyer, cart, totalAmount, totalItems } = req.body;

    if (!buyer) {
      return res.status(400).json({ error: 'Buyer information is required' });
    }

    const user = await userModel.findById(buyer);
    if (!user) {
      return res.status(400).json({ error: 'Buyer not found' });
    }

    const newOrder = new orderModel({
      fullName,
      phone,
      email,
      address,
      city,
      state,
      zip,
      paymentMethod,
      buyer, // Ensure that buyer is correct
      cart,
      totalAmount,
      totalItems,
    });

    const order = await newOrder.save();
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error while creating order' });
  }
}; 

const orders = async (req, res) => {
  try {
    // Fetch orders sorted by createdAt in descending order (most recent first)
    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 }) // Sort by the latest orders first
      .populate({
        path: "cart.productId", // Populate productId inside cart array
        model: "Product", // Reference the Product model
      });

    // Log the orders array to ensure they're sorted properly
    console.log("Fetched orders (sorted by createdAt):", orders);

    // Check if orders exist
    if (!orders || orders.length === 0) {
      return res.status(400).json({ status: "failed", message: "Orders not found" });
    }

    // Return the fetched orders
    res.status(200).json({ status: "success", orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error while fetching orders" });
  }
};


 
const order=async(req,res)=>{
try{
  const {id}=req.params;
  const orders=await OrderModel.find({id});
  if(!orders){
    res.status(400).json({status:"failed",message:"order not found"})
  }
  res.status(200).json({status:"success",orders:orders})
}catch (error) {
  console.error('Error creating order:', error);
  res.status(500).json({ error: 'Server error while creating order' });
}

}

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Find the order by ID and update its status
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong while updating the order status',
    });
  }
};

const searchBykeyword=async(req,res)=>{
 try{
  const {keyword}=req.params;
  const result=await Product.find({
    $or:[{name:{$regex:keyword,$options:"i"}},
      {description:{$regex:keyword,$options:"i"}},
    ],})
    if(!result){
      res.status(400).json({status:"failed",message:"proudct not found"})
    }
    res.status(200).json({status:"succss",result:result})
 }catch (error) {
  console.error('Error updating order status:', error);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong while updating the order status',
  });
}
}
module.exports={
  CreateProduct,UpdateProduct,deleteProduct,product,
  allProduct,checkout,orders,
  order,updateOrderStatus,searchBykeyword
}