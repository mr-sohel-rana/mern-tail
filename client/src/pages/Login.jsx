import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout/Layout";
import img from '../assets/banner/signin.gif';
import { useAuth } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth(); // Now destructure both `auth` and `setAuth`

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/v1/login", { email, password });

      console.log(response.data); // Check the response for debugging

      if (response.data.status === "success") {
        toast.success("Login successful!");

        // Update auth context and localStorage
        setAuth({
          user: response.data.user,
          token: response.data.token,
        });

        localStorage.setItem('auth', JSON.stringify({
          user: response.data.user,
          token: response.data.token,
        }));

        setTimeout(() => {
          navigate("/"); // Redirect after 2 seconds
        }, 2000);
      } else {
        toast.error(response.data.message); // Show error message
      }
    } catch (error) {
      toast.error("Login failed, please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-5 border-2 border-blue-600 w-80 p-5 rounded-lg shadow-lg"
      >
        <img 
          className="mx-auto w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          src={img} 
          alt="Profile" 
          required 
        />
        {/* Email Input */}
        <div className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-5 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

        {/* Register Redirect */}
        <p className="mt-3 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
      <ToastContainer />
    </Layout>
  );
};

export default Login;
