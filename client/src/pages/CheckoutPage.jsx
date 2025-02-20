import React, { useState } from 'react';
import { useCart } from '../context/cartContex';
import { toast } from 'react-toastify'; // Importing toast
import 'react-toastify/dist/ReactToastify.css'; // Importing the required CSS for toast
import axios from 'axios';
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for routing

const CheckoutPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'cashOnDelivery', // default payment method
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false); // For order success state
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission default action

    // Check if user is logged in
    if (!auth?.token) {
      toast.error('Please login to place an order');
      navigate('/login'); // Redirect to login page
      return;
    }

    setLoading(true);

    const orderData = {
      fullName: formData.firstName + ' ' + formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      paymentMethod: formData.paymentMethod,
      totalAmount: totalPrice,
      totalItems: cart.length,
      cart: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      buyer: auth.user._id,  // Assuming userId is available and represents the logged-in user
    };

    console.log(orderData);

    try {
      const response = await axios.post('http://localhost:5001/api/v1/checkout', orderData, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`, // Include the token in the request headers
        },
      });

      toast.success('Order placed successfully!'); // Toast for successful order
      setCart([]); // Reset cart
      setOrderSuccess(true); // Update order success state

      // Navigate to home page
      navigate('/');

    } catch (error) {
      console.error('Checkout Error:', error);
      toast.error(error.response?.data?.error || 'Something went wrong. Please try again.'); // Toast for error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-[sans-serif] bg-white">
      <div className="flex max-sm:flex-col gap-12 max-lg:gap-4 h-full">
        <div className="bg-gray-100 sm:h-screen sm:sticky sm:top-0 lg:min-w-[370px] sm:min-w-[300px]">
          <div className="relative h-full">
            <div className="px-4 py-8 sm:overflow-auto sm:h-[calc(100vh-60px)]">
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-32 h-28 max-lg:w-24 max-lg:h-24 flex p-3 shrink-0 bg-gray-200 rounded-md">
                      <img src={`http://localhost:5001/uploads/${item.photos[0]}`} className="w-full object-contain" />
                    </div>
                    <div className="w-full">
                      <h3 className="text-sm lg:text-base text-gray-800">{item.name}</h3>
                      <ul className="text-xs text-gray-800 space-y-1 mt-3">
                        <li className="flex flex-wrap gap-4">Size <span className="ml-auto">{item.size}</span></li>
                        <li className="flex flex-wrap gap-4">Quantity <span className="ml-auto">{item.quantity}</span></li>
                        <li className="flex flex-wrap gap-4">Total Price <span className="ml-auto">${item.price * item.quantity}</span></li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:absolute md:left-0 md:bottom-0 bg-gray-200 w-full p-4">
              <h4 className="flex flex-wrap gap-4 text-sm lg:text-base text-gray-800">Total <span className="ml-auto">${totalPrice}</span></h4>
            </div>
          </div>
        </div>

        <div className="max-w-4xl w-full h-max rounded-md px-4 py-8 sticky top-0">
          <h2 className="text-2xl font-bold text-gray-800">Complete your order</h2>
          <form className="mt-8" onSubmit={handleSubmit}>
            <div>
              <h3 className="text-sm lg:text-base text-gray-800 mb-4">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    name="phone"
                    placeholder="Phone No."
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm lg:text-base text-gray-800 mb-4">Shipping Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address Line"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm lg:text-base text-gray-800 mb-4">Payment Method</h3>
              <div className="space-y-2">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={formData.paymentMethod === 'cashOnDelivery'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Cash on Delivery
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={formData.paymentMethod === 'creditCard'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Credit Card (coming soon)
                </label>
              </div>
            </div>

            <div className="flex gap-4 max-md:flex-col mt-8">
              <button
                type="button"
                className="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-800 max-md:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Complete Purchase'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;