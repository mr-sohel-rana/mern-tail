import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout/Layout';
import AdminMenu from './AdminMenu';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders from the API
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/v1/orders');
      if (data.status === 'success' && data.orders) {
        setOrders(data.orders);
      } else {
        toast.error('No orders found');
      }
    } catch (error) {
      toast.error('Something went wrong while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating status for order:', orderId, 'to:', newStatus);

      // Send the update request to the server
      const { data } = await axios.put(
        `http://localhost:5001/api/v1/orders/${orderId}`,
        { status: newStatus },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Server response:', data);

      if (data.status === 'success') {
        // Update local state only after a successful API response
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success('Order status updated successfully');
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex mt-28">
        {/* Sidebar */}
        <div>
          <AdminMenu />
        </div>

        {/* Main Content */}
        <div className="p-6 bg-gray-100 min-h-screen w-full">
          <h1 className="text-2xl font-bold mb-6">All Orders</h1>

          <div className="space-y-6">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  {/* Order Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md"
                      >
                        <option value="not processing">Not Processing</option>
                        <option value="processing">Processing</option>
                        <option value="out for delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer & Payment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Details */}
                    <div>
                      <h3 className="text-md font-semibold mb-2">Customer Details</h3>
                      <p><strong>Name:</strong> {order.fullName}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Phone:</strong> {order.phone}</p>
                      <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}, {order.zip}</p>
                    </div>

                    {/* Payment Details */}
                    <div>
                      <h3 className="text-md font-semibold mb-2">Payment Details</h3>
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                      <p><strong>Total Items:</strong> {order.totalItems}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-6">
                    <h3 className="text-md font-semibold mb-4">Order Items</h3>
                    
                    {/* Grid layout for 4 items per row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {order.cart.map((item) => (
                        <div key={item._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                          {/* Product Image */}
                          <div className="w-full h-32 flex items-center justify-center bg-white rounded-md">
                            {item.productId?.photos?.length > 0 ? (
                              <img
                                src={`http://localhost:5001/uploads/${item.productId.photos[0]}`}
                                alt={item.productId?.name || item.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <p className="text-gray-500">No Image</p> // Fallback if image is missing
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="mt-2 text-center">
                            <p className="font-semibold">{item.productId?.name || item.name}</p>
                            <p className="text-gray-700">Quantity: {item.quantity}</p>
                            <p className="text-gray-700">Price: ${item.price}</p>
                            <p className="text-gray-700">Subtotal: ${item.subtotal}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllOrders;
