import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
import { Link } from 'react-router-dom';
import SearchForm from '../Form/SearchForm';
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from '../../context/authContext';
import { useCart } from '../../context/cartContex';

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cart]=useCart();

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-99 bg-white shadow-lg p-3'>
      <div className="flex justify-between items-center">
        <div className="logo">
        <Link to="/">  <img className='h-16 w-16' src={logo} alt="Logo" /></Link>
        </div>

        <div>
          <SearchForm />
        </div>

        <nav className='text-xl'>
          <ul className='flex space-x-3.5'>
            <li>
              <Link to="/cart">
                <FaShoppingCart className='text-blue-600 text-3xl' />
              </Link>
              <p className='text-red-500 font-bold mt-[-47px] ml-5'>{cart.length}</p>
            </li>

            {!auth?.token ? (
              <>
                <li>
                  <Link to="/login" className='bg-blue-600 p-1 rounded-2xl text-white hover:bg-blue-800'>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className='bg-blue-600 p-1 rounded-2xl text-white hover:bg-blue-800'>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='text-blue-600 mr-2 cursor-pointer' onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img src={`http://localhost:5001/api/v1/photo/${auth?.user?._id}`}
                    className="rounded-full h-10 w-10 border-2 border-gray-300"
                  />
                </li>

                {dropdownOpen && (
                  <div className="absolute bg-white shadow-lg mt-8 right-0.5 md:right-5 p-2 rounded-md z-10">
                    <ul className="space-y-6">
                      <li>
                        <Link to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="block text-blue-600 hover:text-blue-800">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="block text-blue-600 hover:text-blue-800 w-full text-left">
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
