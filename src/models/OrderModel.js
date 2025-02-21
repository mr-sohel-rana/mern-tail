const mongoose = require('mongoose');
const User = require("./userModel");
const Product = require("./productModel");

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },  // Added state
  zip: { type: String, required: true },    // Added zip
  paymentMethod: { type: String, required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure buyer is required
  status: {
    type: String,
    enum: ['not processing', 'processing', 'out for delivery', 'delivered', 'canceled'],
    default: 'not processing',
  },
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    subtotal: { type: Number },
  }],
  totalAmount: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the created time to now
  },
});

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;
