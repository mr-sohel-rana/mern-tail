import React from 'react';  // Add this import
 import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoutes from './user/userRoutes';
import Profile from './user/Profile';
import Dashboard from './user/Dashboard';
import UpdateProfile from './user/UpdateProfile';
import Orders from './user/Orders';
import AdminRoutes from './admin/AdminRoutes';
import AdminDashboard from './admin/AdminDashboard';
import AdminProfile from './admin/AdminProfile';
import AdminUpdateProfile from './admin/AdminProfileUpdate';
import AllOrders from './admin/AllOrders';
import AllUsers from './admin/AllUsers';
import CreateCategory from './admin/createCategory';
 

function App() {
 

  return (
    <>
        <Routes>
       <Route path='/' element={<Home />} /> 
       <Route path='/login' element={<Login />} /> 
       <Route path='/register' element={<Register />} /> 

       {/* admin routes */}
       <Route path='/dashboard' element={<AdminRoutes />}>
       <Route path="admin" element={<AdminDashboard />} />
       <Route path='admin/profile' element={<AdminProfile />} /> 
       <Route path='admin/update/:id' element={<AdminUpdateProfile />} /> 
       <Route path='admin/orders' element={<AllOrders />} /> 
       <Route path='admin/create-category' element={<CreateCategory />} /> 
       <Route path='admin/users' element={<AllUsers />} /> 

       </Route>
       {/* privet routes */}
       <Route path='/dashboard' element={<PrivateRoutes />}>
       <Route path="user" element={<Dashboard />} />
       <Route path='user/profile' element={<Profile />} /> 
       <Route path='user/update/:id' element={<UpdateProfile />} /> 
       <Route path='user/orders/:id' element={<Orders />} /> 

       </Route>

          
        </Routes>
    </>
  );
}

export default App;
