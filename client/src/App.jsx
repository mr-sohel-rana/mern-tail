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
 

function App() {
 

  return (
    <>
        <Routes>
       <Route path='/' element={<Home />} /> 
       <Route path='/login' element={<Login />} /> 
       <Route path='/register' element={<Register />} /> 

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
