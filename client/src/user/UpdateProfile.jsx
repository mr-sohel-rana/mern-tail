import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/authContext";

const UpdateProfile = () => {
  const { id } = useParams();  // Getting userId from the URL params
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();  // Using auth context
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the user data on mount and whenever the userId changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/v1/user/${id}`);
        const user = response.data.user || {};
        console.log("user ",id)
        setFormData({
          name: user.name || "",
          email: user.email || "",
        });
      } catch (error) {
        toast.error("Error fetching user data");
      }
    };

    if (id) fetchUser();  // Fetch user data if userId exists
  }, [id]);

  // Handle input changes in the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file change for profile photo
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Handle form submission for updating the profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);  // Set loading to true while submitting
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
    if (photo) formDataToSend.append("photo", photo);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/v1/updateUser/${id}`,  // Use userId here for update
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(response.data.message || "User updated successfully");
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: response.data.user || prevAuth.user,
      }));

      navigate("/dashboard/user/profile");  // Redirect to the profile page after successful update
    } catch (error) {
      toast.error("Error updating user");
    } finally {
      setLoading(false);  // Set loading to false after submission
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Update Profile</h2>

          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <img
              src={
                photo
                  ? URL.createObjectURL(photo)
                  : `http://localhost:5001/api/v1/photo/${id}`  // Use userId here for fetching photo
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Upload Image */}
            <label className="block text-center py-2 px-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {photo && (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Selected"
                  className="mt-2 w-24 h-24 rounded-lg object-cover mx-auto"
                />
                <button
                  type="button"
                  className="text-red-600 text-sm mt-1"
                  onClick={() => setPhoto(null)}
                >
                  Remove Photo
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <ToastContainer />
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProfile;
