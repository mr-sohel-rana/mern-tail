import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import img from "../assets/banner/signin.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import axios from "axios";
 
 
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: null,
  });
  const navigate=useNavigate()
 
  // Handle input changes (for name, email, password)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle photo upload
  const handleImageUpload = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0], // Update the photo field in formData
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create FormData to send the data including the photo as a file
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("photo", formData.photo);
    

    try {
      const response = await axios.post("http://localhost:5001/api/v1/register", data);
      if (response.data.status === "succes") {
        toast.success("Registration successful!");
         
        setTimeout(() => {
            navigate("/login");  
          }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout>
      {/* Toast Notification */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-5 border-2 border-blue-600 w-80 p-5 rounded-lg shadow-lg"
      >
        {/* Image Upload */}
        <label className="flex flex-col items-center cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
          <img
            className="mx-auto w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            src={formData.photo ? URL.createObjectURL(formData.photo) : img}
            alt="Profile" required
          />
          <span className="mt-2 text-blue-600 text-sm">
            {formData.photo ? formData.photo.name : "Upload Photo"}
          </span>
        </label>

        {/* Name Input */}
        <div className="mt-4">
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mt-3">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mt-3">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-5 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>

        {/* Login Redirect */}
        <p className="mt-3 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
      <ToastContainer />
    </Layout>
  );
};

export default Register;
