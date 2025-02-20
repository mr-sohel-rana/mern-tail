import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useCart } from '../context/cartContex';
import { toast } from 'react-toastify'; 
import CarouselCreate from './Carousel';
import categoryCarousel from './categoryCarousel';
import Test from './test';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useCart(); 

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5001/api/v1/allproduct');
      setProducts(data.product);
    } catch (e) {
      console.log(e);
      toast.error("Failed to load products. Try again!"); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((item) => item._id === product._id);

    if (existingIndex !== -1) {
      toast.info("Product is already in the cart"); 
    } else {
      updatedCart.push({ ...product, quantity: 1 });
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success("Added to cart");
    }
  };

  return (
    <Layout>
      <div>
        <CarouselCreate />
      </div>
      <div>
        <h1 className='mx-auto text-center items-center text-blue-400 text-3xl'> all category </h1>
         <Test className='mt-5' />
      </div>

      <div className="container mt-10">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-6">All Products</h1>

          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (

    <div className="font-[sans-serif] bg-gray-100 p-4 mx-auto lg:max-w-7xl md:max-w-4xl sm:max-w-xl max-sm:max-w-sm">
    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 sm:mb-10">Your Cart</h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
      {products.map((p) => (
        <div key={p._id} className="bg-white rounded p-4 cursor-pointer hover:-translate-y-1 transition-all relative shadow-lg">
          <div className="mb-4 bg-gray-100 rounded p-2">
            <img 
              src={p.photos && p.photos.length > 0 ? `http://localhost:5001/uploads/${p.photos[0]}` : "/fallback-image.jpg"} 
              alt={p.name} 
              className="aspect-[33/35] w-full object-contain" 
            />
          </div>
          
          <div>
            <div className="flex gap-2">
              <h5 className="text-base font-bold text-gray-800">{p.name}</h5>
              <h6 className="text-base text-gray-800 font-bold ml-auto flex items-center">
                <FaBangladeshiTakaSign className="mr-1" />{p.price}
              </h6>
            </div>
            <p className="text-gray-500 text-[13px] mt-2">Premium quality product.</p>
            <div className="flex items-center gap-2 mt-4">
              <Link to={`/details/${p._id}`}>
                <button className="text-sm px-2 h-9 font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 tracking-wide outline-none border-none rounded">Details</button>
              </Link>
              <button 
                onClick={() => addToCart(p)} 
                className="text-sm px-2 h-9 font-semibold w-full bg-blue-600 hover:bg-blue-700 text-white tracking-wide outline-none border-none rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
