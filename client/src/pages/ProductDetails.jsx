import React, { useState, useEffect } from 'react';
import Layout from './../components/Layout/Layout';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useCart } from '../context/cartContex';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useCart();
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/v1/single-product/${id}`);
        if (data.status === 'success') {
          setProduct(data.product);
          setSelectedImage(data.product.photos[0]);
        } else {
          toast.error('Failed to load product');
        }
      } catch (error) {
        toast.error('Error fetching product details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    if (!product) return;
  
    const existingProductIndex = cart.findIndex((item) => item._id === product._id);
    const updatedCart = [...cart];
  
    if (existingProductIndex !== -1) {
      // Update the existing product's quantity with the latest quantity selected
      updatedCart[existingProductIndex].quantity = quantity;
      toast.success("Cart updated successfully");
    } else {
      // Add new product with the selected quantity
      updatedCart.push({ ...product, quantity });
      toast.success("Added to cart successfully");
    }
  
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
   

  if (isLoading) return <Layout><p>Loading product details...</p></Layout>;
  if (!product) return <Layout><p>Product not found.</p></Layout>;

  return (
    <Layout>
      <div className="font-[sans-serif] mt-24 p-4 bg-gray-100">
        <div className="lg:max-w-6xl max-w-xl mx-auto">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-12 max-sm:gap-8">
            <div className="w-full lg:sticky top-0">
              <div className="flex flex-col gap-4">
                <div className="bg-white shadow p-2">
                  <img 
                    src={`http://localhost:5001/uploads/${selectedImage}`} 
                    alt="Main Product"
                    className="w-full aspect-[11/8] object-cover object-top"
                  />
                </div>
                <div className="bg-white p-2 w-full max-w-full overflow-auto">
                  <div className="flex justify-between flex-row gap-4 shrink-0">
                    {product.photos.slice(0, 5).map((photo, index) => (
                      <img 
                        key={index}
                        className={`w-16 h-16 aspect-square object-cover object-top cursor-pointer shadow-md border-b-2 ${selectedImage === photo ? 'border-blue-600' : 'border-transparent'}`}
                        src={`http://localhost:5001/uploads/${photo}`} 
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setSelectedImage(photo)} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{product.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-base text-gray-500">4.5</p>
                  <span className="text-gray-500">|</span>
                  <p className="text-sm text-gray-500">76 Ratings</p>
                  <span className="text-gray-500">|</span>
                  <p className="text-sm text-gray-500">50 Reviews</p>
                </div>
                <div className="mt-2">
                  <p className="text-gray-500 mt-1 text-sm">{product.description}</p>
                </div>
                <div className="flex items-center flex-wrap gap-2 mt-4">
                  <p className="text-gray-500 text-base"><strike>{product.oldPrice}</strike></p>
                  <h4 className="text-purple-800 text-2xl sm:text-3xl font-bold">{product.price} ৳</h4>
                  <div className="flex py-1 px-2 bg-purple-600 font-semibold !ml-4">
                    <span className="text-white text-sm">save 10%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 bg-gray-200 rounded-full">-</button>
                  <span className="text-gray-800 text-sm font-semibold">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 bg-gray-200 rounded-full">+</button>
                </div>
                <div className="flex gap-4 mt-6">
                  <button 
                    type="button"
                    onClick={addToCart}
                    className="px-4 py-3 w-[45%] border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold"
                  >
                    Add to cart
                  </button>
                  <Link to='/checkout'>
                    <button className="px-4 py-3 w-auto border border-purple-600 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold">
                      Buy it now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
