import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";  // Import the toast function
import "react-toastify/dist/ReactToastify.css";  // Import CSS for toast notifications
import Layout from "../components/Layout/Layout";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/v1/forgot", { email });

      if (res.status === 200) {
        // Show success message
        toast.success(res.data.message);

        // Navigate to verify-otp page with email as state
        navigate("/varify-otp", { state: { email } });
      } else {
        // Handle failure response
        toast.error(res.data.message);
      }
    } catch (error) {
      // Handle errors
      console.error("Error in submitting email:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-28 border-2 border-blue-600 w-80 p-5 rounded-lg shadow-lg"
      >
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
        {/* Submit Button */}
        <button
          type="submit"
          className="mt-5 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Send OTP
        </button>
      </form>
    </Layout>
  );
};

export default ForgetPassword;
