import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import Layout from "../components/Layout/Layout";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation(); // Access the location state (email)

  // Get the email from the previous page (passed through navigate)
  const email = location?.state?.email;

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers and empty values

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next field if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous field when backspace is pressed
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    try {
      // Send OTP to backend for verification
      const res = await axios.post("http://localhost:5001/api/v1/otp-varify", {
        otp: otpValue,
        email: email, // Send the email along with OTP for verification
      });

      if (res.status === 200) {
        // Show success message
        toast.success(res.data.message);

        // Navigate to reset-password page and carry the email in state
        navigate("/reset-password", { state: { email: email, otp: otpValue } })
      } else {
        // Handle failure response (invalid OTP)
        setError(res.data.message);
      }
    } catch (error) {
      console.error("Error in OTP verification:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-28 border-2 border-blue-600 w-80 p-5 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-lg font-semibold mb-4">Enter OTP</h2>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-5 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Verify OTP
        </button>
      </form>
    </Layout>
  );
};

export default VerifyOTP;
