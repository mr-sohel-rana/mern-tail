import React from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/authContext';
import AdminMenu from './AdminMenu';
 

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="container mt-20 mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar (User Menu) */}
          <div className="md:col-span-3">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="md:col-span-9 bg-white shadow-lg text-center rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">User Dashboard</h1>
            <div className="border p-4 rounded-lg shadow-md bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700">
                Name: <span className="font-normal">{auth?.user?.name}</span>
              </h3>
              <h3 className="text-lg font-semibold text-gray-700">
                Email: <span className="font-normal">{auth?.user?.email}</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
