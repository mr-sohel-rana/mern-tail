import React from 'react';  // Add this import
 
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx';
import { CartProvider } from './context/cartContex.jsx';
import { SearchProvider } from './context/searchContext.jsx';

createRoot(document.getElementById('root')).render(
<AuthProvider>
 <SearchProvider>
 <CartProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </CartProvider>
 </SearchProvider>

  </AuthProvider>
  
);
