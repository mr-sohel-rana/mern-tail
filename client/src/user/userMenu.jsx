import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../src/context/authContext.jsx';
import { FaUser, FaEdit, FaShoppingCart } from 'react-icons/fa';

const UserMenu = () => {
  const [auth] = useAuth();

  return (
    <div className="w-full  max-w-xs bg-white shadow-lg rounded-2xl p-5">
      <h2 className="text-lg text-center font-semibold text-gray-800 mb-4">User Panel</h2>
      <ul className="space-y-2 text-center  ">
        <li>
          <NavLink
            to="/dashboard/user/profile"
            className="flex gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <FaUser className="w-5 h-5 text-center" /> Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/dashboard/user/update/${auth?.user?._id}`}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <FaEdit className="w-5 h-5" /> Update
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/user/order"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <FaShoppingCart className="w-5 h-5" /> Orders
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;