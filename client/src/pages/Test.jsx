import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Test = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch categories
  const allCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/v1/allcategory");
      if (data.status === "success" && data.allCategory.length > 0) {
        setCategories(data.allCategory);
        toast.success("Categories Fetched Successfully");
      } else {
        toast.error("No categories found");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      setCategories([]);
    }
  };

  useEffect(() => {
    allCategory();

    const interval = setInterval(() => {
      if (!isHovered && categories.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [categories.length, isHovered]);

  // Visible Categories (Dynamic Grid Size)
  const getVisibleCount = () => {
    if (window.innerWidth >= 1024) return 6;
    if (window.innerWidth >= 768) return 5;
    if (window.innerWidth >= 640) return 4;
    return 3;
  };

  const visibleCategories = categories.slice(currentIndex, currentIndex + getVisibleCount());

  return (
    <div
      className="relative flex items-center justify-center w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && categories.length > getVisibleCount() && (
        <button
          className="absolute left-2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full cursor-pointer hover:bg-opacity-80 transition-all text-2xl"
          onClick={() =>
            setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length)
          }
        >
          &lt;
        </button>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 transition-transform duration-700 ease-in-out">
        {visibleCategories.map((category, index) => (
          <Link to="/" key={category?._id || index} className="box-border">
            <div>
              <img
                src={`http://localhost:5001/api/v1/categoryimage/${category?._id}`}
                alt={category?.categoryName}
                className="h-40 w-full block rounded-lg shadow-md hover:scale-105 transition-transform"
                onError={(e) => (e.target.src = "/images/fallback.png")}
              />
              <p className="text-center mt-2">{category?.categoryName}</p>
            </div>
          </Link>
        ))}
      </div>

      {isHovered && categories.length > getVisibleCount() && (
        <button
          className="absolute right-2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full cursor-pointer hover:bg-opacity-80 transition-all text-2xl"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % categories.length)}
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default Test;
