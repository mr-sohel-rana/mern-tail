import React from 'react';
import { CiSearch } from "react-icons/ci";

const SearchForm = () => {
  return (
    <div className="w-full flex justify-center">
      <form className="max-w-md w-full sm:w-32 md:w-56 lg:w-80 mx-auto rounded-full">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <CiSearch className="text-gray-500 text-xl" />
          </div>

          {/* Search Input */}
          <input
            type="search"
            id="default-search"
            className="block w-full border border-gray-300 p-3 pl-10 text-sm text-blue-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search here"
            required
          />

          {/* Search Button */}
          <button
            type="submit"
            className="text-white absolute right-1 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
