import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FaUsers, FaUser, FaEdit, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";

const AdminMenu = () => {
  const [auth] = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-24 left-4 p-2 text-gray-700 z-50 bg-white shadow-md rounded-md"
      >
        <FaBars size={24} />
      </button>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div 
           
          onClick={() => setIsOpen(false)} // Clicking outside closes the menu
        />
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed md:relative top-0 left-0 w-64 h-screen bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:w-full md:max-w-sm lg:max-w-md p-5 rounded-2xl z-50`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-700"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-lg text-center font-semibold text-gray-800 mb-4">
          Admin Panel
        </h2>

        <ul className="space-y-2 text-center">
          {[
            { to: "/dashboard/admin/profile", icon: <FaUser />, label: "Profile" },
            { to: `/dashboard/admin/update/${auth?.user?._id}`, icon: <FaEdit />, label: "Update" },
            { to: "/dashboard/admin/create-category", icon: <IoIosCreate />, label: "Create Category" },
            { to: "/dashboard/admin/create-product", icon: <IoIosCreate />, label: "Create Product" },
            { to: "/dashboard/admin/products", icon: <IoIosCreate />, label: "Products" },
            { to: "/dashboard/admin/orders", icon: <FaShoppingCart />, label: "All Orders" },
            { to: "/dashboard/admin/users", icon: <FaUsers />, label: "All Users" },
          ].map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.to}
                onClick={() => setIsOpen(false)} // Close menu when a link is clicked
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-lg transition ${
                    isActive ? "bg-gray-200 font-semibold" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminMenu;
