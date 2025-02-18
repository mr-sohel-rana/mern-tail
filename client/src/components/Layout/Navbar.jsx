import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
import { Link } from 'react-router-dom';
import SearchForm from '../Form/SearchForm';
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from '../../context/authContext';

const Navbar = () => {
  const [auth, setAuth] = useAuth(); // Destructuring auth directly
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility
 
  const handleLogout = () => {
    // Clear auth context and localStorage on logout
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return (
    <header className='items-center flex justify-between p-3 shadow-2xl'>
      <div className="logo">
        <img className='h-16 w-16' src={logo} alt="Logo" />
      </div>
      
      <div>
        <SearchForm />
      </div>
      
      <nav className='text-xl'>
        <ul className='flex md:mr-8   space-x-3.5'>
          {/* Shopping Cart Icon - Add a link */}
          <li>
            <Link to="/cart">
              <FaShoppingCart className='text-blue-600 text-3xl' />
            </Link>
          </li>

          {/* Conditional rendering based on authentication */}
          {!auth?.token? (
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
              {/* Display user name and dropdown menu */}
              <li 
                className='text-blue-600 mr-2 cursor-pointer'
                onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
              >
                <img src={`http://localhost:5001/api/v1/photo/${auth?.user?._id}`}
                className="rounded-full h-10 w-10 border-2 border-gray-300"/>

              </li>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute bg-white shadow-lg mt-8 right-0.5 md:right-5 p-2 rounded-md z-10">
                  <ul className="space-y-6">
                    <li> 
                      <Link to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="block text-blue-600 hover:text-blue-800">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block text-blue-600 hover:text-blue-800 w-full text-left"
                      >
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
    </header>
  );
};

export default Navbar;
