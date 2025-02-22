import React from 'react';  // Add this import
 import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoutes from './user/userRoutes';
import Profile from './user/Profile';
import Dashboard from './user/Dashboard';
import Orders from './user/Orders';
import AdminRoutes from './admin/AdminRoutes';
import AdminDashboard from './admin/AdminDashboard';
import AdminProfile from './admin/AdminProfile';
import AdminUpdateProfile from './admin/AdminProfileUpdate';
import AllOrders from './admin/AllOrders';
import AllUsers from './admin/AllUsers';
import CreateCategory from './admin/createCategory';
import CreateProduct from './admin/CreateProduct';
 
import Products from './admin/Products';
import UpdateProduct from './admin/UpdateProduct';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage';
 
 
import Test from './pages/test';
import Search from './pages/SearchReasult';
import ForgetPassword from './pages/ForgetPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
 
 
 
 

function App() {
 

  return (
    <>
        <Routes>
       <Route path='/' element={<Home />} /> 
       <Route path='/login' element={<Login />} /> 
       <Route path='/register' element={<Register />} /> 
       <Route path='/cart' element={<Cart />} /> 
       <Route path='/details/:id' element={<ProductDetails/>} /> 
       <Route path='/checkout' element={<CheckoutPage />} />
       <Route path='/test' element={<Test />} />
       <Route path='/search' element={<Search />} />
       <Route path='/forgot-password' element={<ForgetPassword />} />
       <Route path='/varify-otp' element={<VerifyOTP />} />
       <Route path='/reset-password' element={<ResetPassword />} />

       {/* admin routes */}
       <Route path='/dashboard' element={<AdminRoutes />}>
       <Route path="admin" element={<AdminDashboard />} />
       <Route path='admin/profile' element={<AdminProfile />} /> 
       <Route path='admin/update/:id' element={<AdminUpdateProfile />} /> 
       <Route path='admin/orders' element={<AllOrders />} /> 
       <Route path='admin/create-category' element={<CreateCategory />} /> 
       <Route path='admin/create-product' element={<CreateProduct />} /> 
       <Route path='admin/products' element={<Products/>} /> 
       <Route path='admin/updateproduct/:id' element={<UpdateProduct/>} /> 
       <Route path='admin/users' element={<AllUsers />} /> 

       </Route>
       {/* privet routes */}
       <Route path='/dashboard' element={<PrivateRoutes />}>
       <Route path="user" element={<Dashboard />} />
       <Route path='user/profile' element={<Profile />} /> 
       <Route path='user/orders/:id' element={<Orders />} /> 

       </Route>

          
        </Routes>
    </>
  );
}

export default App;
