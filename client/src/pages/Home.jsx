import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useCart } from '../context/cartContex';
import { toast } from 'react-toastify';
import CarouselCreate from './Carousel';
import Test from './test';
import { Checkbox, Radio } from 'antd';
import { Prices } from './Prices';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching products
  const [isFiltering, setIsFiltering] = useState(false); // Loading state for filtering
  const [cart, setCart] = useCart(); // Cart context
  const [checked, setChecked] = useState([]); // Selected categories
  const [radio, setRadio] = useState([]); // Selected price range
  const [categories, setCategories] = useState([]); // All categories
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products

  const productPerPage = 10; // Number of products per page

  // Calculate pagination indices
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Total pages for pagination
  const totalPages = Math.ceil(filteredProducts.length / productPerPage);

  // Fetch all products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5001/api/v1/allproduct');
      setProducts(data.product); // Store all products
      setFilteredProducts(data.product); // Initialize filteredProducts
    } catch (e) {
      toast.error("Failed to load products. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const allCategory = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/v1/allcategory');
        if (data.status === 'success') {
          setCategories(data.allCategory || []);
          toast.success('Categories Fetched Successfully');
        } else {
          toast.error(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        toast.error('Something went wrong!');
        setCategories([]);
      }
    };
    allCategory();
  }, []);

  // Handle category filter change
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // Handle price range change
  const handlePriceFilter = (e) => {
    setRadio(e.target.value);
  };

  // Filter products based on selected categories and price range
  const filterProduct = async () => {
    setIsFiltering(true);
    try {
      const { data } = await axios.post("http://localhost:5001/api/v1/productfilter", { check: checked, radio });
      setFilteredProducts(data?.products || []);
    } catch (e) {
      console.error("Error during filter:", e.response ? e.response.data : e.message);
      setFilteredProducts([]);
    } finally {
      setIsFiltering(false);
    }
  };

  // Re-fetch products when filters change
  useEffect(() => {
    if (!checked.length && !radio.length) {
      setFilteredProducts(products); // Reset to all products when no filters are applied
    } else {
      filterProduct(); // Apply filters when checked or radio change
    }
  }, [checked, radio]);

  // Add to cart function
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    toast.success(`${product.name} added to cart!`);
  };

  // Reset filters function
  const resetFilters = () => {
    setChecked([]); // Reset category filters
    setRadio([]); // Reset price filter
    setFilteredProducts(products); // Reset filteredProducts to the original list
  };

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <div>
        <CarouselCreate />
      </div>

      <div>
        <h1 className='mx-auto text-center items-center text-blue-400 text-3xl'> All Categories </h1>
        <Test className='mt-5' />
      </div>

      <div className='flex  '>
        {/* Category Filter Section */}
        <div className="mb-8 hidden sm:hidden md:block lg:block">
          <h1 className="ml-2 font-semibold  text-gray-800 mb-4">Selected Category</h1>
          <div className="space-y-4 flex flex-col">
            {categories.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                className="text-gray-700 text-lg"
              >
                {c.categoryName}
              </Checkbox>
            ))}
          </div>
        </div>

        {/* Price Filter Section */}
        <div className="mb-8 hidden sm:hidden md:block lg:block">
          <h2 className="font-semibold text-gray-800 mb-4">Filter By Price</h2>
          <div className="space-y-4">
            <Radio.Group onChange={handlePriceFilter} value={radio}>
              {Prices?.map((p) => (
                <div key={p._id} className="flex items-center space-x-2">
                  <Radio value={p.array} className="text-gray-700">
                    <span className="text-lg">{p.name}</span>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <button className='bg-red-500 p-2 hover:bg-red-700' onClick={resetFilters}> Reset filter</button>
        </div>

        {/* Product List Section */}
        <div className="container mt-10">
          <div className="flex-1 p-4">
            <h1 className="text-2xl text-center font-semibold mb-6">All Products</h1>

            {isLoading || isFiltering ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="font-[sans-serif]  p-1 mx-auto lg:max-w-7xl md:max-w-4xl sm:max-w-xl max-sm:max-w-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 max-xl:gap-4 gap-2">
                  {currentProducts.map((p) => (
                    <div key={p._id} className="bg-white rounded p-4 cursor-pointer hover:scale-110   transition-all relative shadow-lg">
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
                            disabled={cart.some(item => item._id === p._id)}
                            className={`text-sm px-2 h-9 font-semibold w-full ${cart.some(item => item._id === p._id) ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white tracking-wide outline-none border-none rounded`}
                          >
                            {cart.some(item => item._id === p._id) ? 'In Cart' : 'Add to Cart'}
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
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex space-x-2">
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {/* Page Number Buttons */}
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </Layout>
  );
};

export default Home;