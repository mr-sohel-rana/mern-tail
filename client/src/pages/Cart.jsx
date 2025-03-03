import React from "react";
import { useCart } from "../context/cartContex";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useCart();

  const handleQuantityChange = (index, change) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += change;
  
    if (updatedCart[index].quantity < 1) { 
      updatedCart[index].quantity = 1;
    }
  
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Sync local storage
  };
  

  const handleRemoveItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  return (
    <Layout>
    <div className="font-sans mt-28 max-w-4xl max-md:max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-md"
            >
              <div className="flex gap-4">
                <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                  <img
                    src={`http://localhost:5001/uploads/${item.photos[0]}`}
                    className="w-full h-full object-contain"
                    alt={item.name}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 mt-2 flex items-center gap-2">
                       Category:
                      <span
                        className="inline-block w-5 h-5 rounded-md"
                        style={{ backgroundColor: item.category.categoyName }}
                      ></span>
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, -1)}
                      className="flex items-center justify-center w-5 h-5 bg-gray-400 rounded-full"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm leading-[18px]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, 1)}
                      className="flex items-center justify-center w-5 h-5 bg-gray-800 text-white rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex flex-col">
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
                <h3 className="text-sm sm:text-base font-bold text-gray-800 mt-auto">
                  ${item.price.toFixed(2)}
                </h3>
                <h3 className="text-sm sm:text-base font-bold text-gray-800 mt-auto">
                 Sub Totol: ${(item.quantity*item.price).toFixed(2)}
                </h3>
              </div> 
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold text-gray-800">Summary</h2>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Total: $
              {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </p>
            <Link to='/checkout'>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
              Checkout
            </button></Link>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Cart;
