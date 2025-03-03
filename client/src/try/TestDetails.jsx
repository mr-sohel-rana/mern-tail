import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TbCurrencyTaka } from "react-icons/tb";
import { useCart } from '../context/cartContex';
import { toast } from 'react-toastify';

const TestDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [showFull, setShowFull] = useState(false);
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productFetch = async () => {
      try {
        const result = await axios.get(`http://localhost:5001/api/v1/single-product/${id}`);
        setProduct(result.data.product);
        setSelectedImage(result.data.product.photos[0]);
      } catch (error) {
        console.log("Error fetching product:", error);
      }
    };
    productFetch();
  }, [id]);

  const shortDescription = product?.description?.substring(0, 100);

 const handleChange=(change)=>{
  const newQuantity=quantity+change;
  if(newQuantity>=1){
    setQuantity(newQuantity)
  }
 }
  const addToCart = () => {
    if(!product) return;
    const existProductIndex = cart.findIndex((item) => item._id === product._id);
    const updateCart = [...cart];

    if (existProductIndex !== -1) {
      updateCart[existProductIndex].quantity = quantity;
      toast.success('Cart updated successfully');
    } else {
      updateCart.push({ ...product, quantity });
      toast.success("Product added to cart");
    }

    setCart(updateCart);
    localStorage.setItem('cart', JSON.stringify(updateCart));
  };

  return (
    <Layout>
      <div className='mt-28 bg-gray-200'>
        <h1 className='text-center text-3xl text-blue-600'> Product Details</h1>
        <div className='flex'>

          {/* Left Side Image Section */}
          <div className='w-1/2 m-16'>
            <div className='w-full h-72 p-2 shadow-2xl bg-white items-center justify-center mx-auto'>
              <img 
                className='object-fill w-full h-full' 
                src={`http://localhost:5001/uploads/${selectedImage}`} 
                alt='main-image' 
              />
            </div>

            <div className='grid grid-cols-5 shadow-2xl bg-white mt-5 p-1 pt-2 gap-3.5'>
              {product?.photos?.slice(0, 5).map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:5001/uploads/${photo}`}
                  alt={`thumbnail${index + 1}`}
                  onClick={() => setSelectedImage(photo)}
                  className={`cursor-pointer rounded-lg shadow-md hover:opacity-80 transition-all duration-300 ${
                    selectedImage === photo ? 'border-4 border-blue-500' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side Details Section */}
          <div className='w-1/2 m-16 space-y-3'>
            <p className='mt-6 text-3xl font-bold'>{product.name}</p>

            <p>
              {showFull ? product.description : shortDescription}
              {product?.description?.length > 100 && (
                <span
                  className='text-blue-600 cursor-pointer font-bold ml-2'
                  onClick={() => setShowFull(!showFull)}
                >
                  {showFull ? " Show Less" : " ...Read More"}
                </span>
              )}
            </p>

            <p>⭐ Rating | Review</p>
            <p className='flex items-center text-3xl text-red-600'>
              <TbCurrencyTaka className='text-2xl' /> {product.price}
            </p>

            <div className='flex items-center space-x-5'>
              <button 
                className='bg-red-600 text-white px-4 py-2 rounded-lg' 
                onClick={() =>handleChange(-1) }
              >
                -
              </button>
              <p className='text-xl'>{quantity}</p>
              <button 
                className='bg-green-600 text-white px-4 py-2 rounded-lg' 
                onClick={() =>handleChange(1)}
              >
                +
              </button>
            </div>

            <button
              className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'
              onClick={addToCart}
            >
              Add to Cart 🛒
            </button>

            <button
              className='bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 ml-3'
              onClick={() => {
                addToCart();
                setTimeout(() => {
                  window.location.href = '/checkout';
                }, 1000);
              }}
            >
<<<<<<< HEAD
              BUY NOW 🚀 fdfdfdfdfdfa
=======
              BUY NOW 🚀
>>>>>>> 803a9ec45b0d8a18637404dcf95754be9a31ad56
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TestDetails;
