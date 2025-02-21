import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5001/api/v1/allproduct');
      setProducts(data.product);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="container mt-24 flex">
        <div className="w-1/4">
          <AdminMenu />
        </div>
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-6">All Products</h1>
          {isLoading ? (
            <div>Loading....</div>
          ) : (
            <div className="m-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {products.map((p) => (
                <div className="w-36 hover:shadow-2xl h-auto    p-1  rounded-md shadow-md" key={p._id}>
                  <img
                    className="w-36 h-32 "
                    src={`http://localhost:5001/uploads/${p.photos[0]}`}
                    alt={p.name}
                  />
                  <p className=" text-blue-600 font-semibold">{p.name}</p>
                  <p className="flex text-blue-600 items-center">
                    <div><FaBangladeshiTakaSign /></div>
                    <div className="ml-1 mt-[-2px]">{p.price}</div>
                    </p>
                   <button className=' w-full rounded-4xl text-white bg-blue-700'> <Link to={`/dashboard/admin/updateproduct/${p._id}`}>Update Product</Link></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
