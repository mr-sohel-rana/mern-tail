import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Layout from "../components/Layout/Layout";
 
import AdminMenu from "./AdminMenu";

const AdminProfile = () => {
  const [auth] = useAuth();
  const [userData, setUserData] = useState(auth?.user || {});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth?.user?._id) {
        try {
          const { data } = await axios.get(`http://localhost:5001/api/v1/user/${auth.user._id}`);
          setUserData(data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, [auth?.user]);

  if (!userData.name) {
    return (
      <Layout>
        <div className="flex mt-20 justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-20 mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar - User Menu */}
          <div className="md:col-span-3">
            <AdminMenu />
          </div>

          {/* Profile Info */}
          <div className="md:col-span-9 bg-white text-center shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{userData.name}'s Profile</h1>

            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <img
                className="w-32 h-32    rounded-full object-cover border-2 border-gray-300"
                src={
                  imageError
                    ? "/path/to/default-image.jpg"
                    : `http://localhost:5001/api/v1/photo/${auth?.user?._id}`
                }
                alt="Profile"
                onError={() => setImageError(true)}
              />
            </div>

            {/* User Details */}
            <div className="mt-4 space-y-2">
              <h4 className="text-lg font-semibold text-gray-700">
                Name: <span className="font-normal">{userData.name}</span>
              </h4>
              <h4 className="text-lg font-semibold text-gray-700">
                Email: <span className="font-normal">{userData.email}</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;
