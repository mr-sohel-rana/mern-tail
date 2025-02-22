import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location?.state?.email;
  const otp = location?.state?.otp; // OTP passed from the previous step
  console.log(email,otp,password)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send reset password request to backend API
      const res = await axios.put("http://localhost:5001/api/v1/reset-password", {
        email,           // Send email for the user whose password is being reset
        otp,             // Send the OTP from the previous page
        newPassword: password,  // Send the new password
      });

      if (res.status === 200) {
        // On success, navigate to login page
        alert("Password reset successful!");
        navigate("/login");
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="border-2 border-blue-600 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>

        {/* New Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!password || !confirmPassword || password !== confirmPassword}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
