import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout/Layout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TbCurrencyTaka } from "react-icons/tb";
 
import CarouselCreate from '../pages/Carousel';

const FirstPage = () => {
  const [categories, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const categoryProductFetch = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/v1/allcategory');
        if (res.data.status === 'success') {
          setCategory(res.data.allCategory);
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Something went wrong!');
      }
    };
    categoryProductFetch();
  }, []);
  useEffect(() => {
    const  ProductsFetch = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/v1/allproduct');
        if (res.data.status === 'success') {
          setProducts(res.data.product);
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Something went wrong!');
      }
    };
     ProductsFetch();
  }, []);
 

  // Scroll Left
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  };

  // Scroll Right
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  };

  return (
    <Layout >
     <div className='bg-gray-200 h-screen container'>

     <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Chrome, Safari, Edge */
          }
          .custom-scrollbar {
            -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
            scrollbar-width: none; /* Hide scrollbar for Firefox */
          }
        `}
      </style>

      <div className='mt-28 relative'>
        {/* Left Arrow Button */}
        <button
          className='absolute left-0 top-1/2 -translate-y-1/2 text-blue-400 rounded-full p-2 z-10'
          onClick={scrollLeft}
        >
          <ChevronLeft />
        </button>

        <div
          ref={scrollRef}
          className='flex items-center gap-3 overflow-x-scroll scroll-smooth custom-scrollbar'
        >
         {categories.map((c) => {
  return (
    <Link to={`/category/${c.categoryName}`} key={c._id}>
      <div className='text-center'>
        <div className='w-20 h-20 p-4 bg-white rounded-full flex items-center justify-center overflow-hidden'>
          <img
            className='w-full hover:scale-125 transition-all h-full object-fill cursor-pointer'
            src={`http://localhost:5001/api/v1/categoryimage/${c._id}`}
            alt={c.categoryName}
          />
        </div>
        <div className='mt-2 capitalize'>{c.categoryName}</div>
      </div>
    </Link>
  );
})}
        </div>

        {/* Right Arrow Button */}
        <button
          className='absolute right-0 top-1/2 -translate-y-1/2   text-blue-400 rounded-full p-2 z-10'
          onClick={scrollRight}
        >
          <ChevronRight />
        </button>
      </div>

      <CarouselCreate />


      <div className='mt-5'>
        <h1 className='text-4xl text-center'>All product </h1>

       <div className=' text-center grid grid-cols-4 lg:grid-cols-8 gap-2'>
       {
        products.map((p) => (
          <Link to={`/firstpage/details/${p._id}`} key={p._id}>
            
  <div className=' hover:translate-y-[-5px] transition-all  shadow-xl'>
    <div className=' h-52 w-auto'>
       
      <div className='p-2 '>
      <img className='h-32 w-full'
      src={`http://localhost:5001/uploads/${p.photos[0]}`}
      alt={p.name}
    />
      </div>
      
    <p>{p.name}</p>
    <p className='flex text-center items-center'><TbCurrencyTaka className='text-2xl text-red-500' />{p.price}</p>
 </div>
  </div>

          </Link>
        ))
}
       </div>

      </div>
     </div>
    </Layout>
  );
};

export default FirstPage;
