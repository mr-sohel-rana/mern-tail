import React from "react";
import { CiSearch } from "react-icons/ci";
import { useSearch } from "../../context/searchContext";
import axios from "axios";
 
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
  const [search, setSearch] = useSearch();
  const Navigate=useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.keyword.trim()) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5001/api/v1/search/${search.keyword}`
      );
      console.log(data)
      setSearch({ ...search, result: data.result || [] });
      Navigate('/search')
       
    } catch (error) {
      console.error("Search error:", error);
    }
  };
 

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto relative">
      <div className="relative">
        <CiSearch className="absolute left-3 top-3 text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search here"
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          className="w-full border p-3 pl-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="absolute right-1 bottom-1 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
