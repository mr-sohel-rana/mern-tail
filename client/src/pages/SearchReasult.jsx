import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/searchContext";

const Search = () => {
  const [search] = useSearch();

  return (
    <Layout>
      <div className="container mx-auto px-4 mt-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          {search.result.length > 0
            ? `${search.result.length} Product(s) Found`
            : "No Product Found"}
        </h2>

        <div className="grid grid-cols-1 mt-28 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {search.result.length > 0 ? (
            search.result.map((product) => (
              <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                {product.photos?.length > 0 && (
                  <img
                    src={`http://localhost:5001/uploads/${product.photos[0]}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h5 className="text-lg font-semibold">{product.name}</h5>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-blue-700 font-bold mt-2">
                    Price: ${product.price}
                  </p>
                  <p className="text-gray-700 mt-1">Quantity: {product.quantity}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Add to Cart
                    </button>
                    <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No products available
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
