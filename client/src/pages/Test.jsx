import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Test = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch categories from API
  const allCategory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/v1/allcategory');
      
      if (data.status === 'success' && data.allCategory && data.allCategory.length > 0) {
        setCategories(data.allCategory); // Update state with fetched categories
        toast.success('Categories Fetched Successfully');
      } else {
        toast.error('No categories found');
      }
    } catch (error) {
      toast.error('Something went wrong!');
      setCategories([]); // Ensure categories is reset on error
    }
  };

  // Automatically move to the next image every 3 seconds
  useEffect(() => {
    allCategory(); // Fetch categories on component mount

    const interval = setInterval(() => {
      if (!isHovered && categories.length > 0) { // Only auto-slide if not hovered and categories are available
        setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
      }
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [categories.length, isHovered]); // Add isHovered as a dependency

  // Get the current set of 6 categories to display
  const visibleCategories = [];
  if (categories.length > 0) {
    for (let i = 0; i < 6; i++) {
      const index = (currentIndex + i) % categories.length;
      visibleCategories.push(categories[index]);
    }
  }

  return (
    <div
      className="relative flex items-center justify-center w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <button
          className="absolute left-0 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full cursor-pointer text-2xl"
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length)}
        >
          &lt;
        </button>
      )}

      <div className="flex justify-center items-center w-4/5">
        {visibleCategories.map((category, index) => (
          <Link
            to="/" // Update the link destination as needed
            key={category?._id || index} // Ensure a unique key
            className="flex-shrink-0 w-1/6 box-border"
          >
            <div>
              <img
                src={`http://localhost:5001/api/v1/categoryimage/${category?._id}`}
                alt={category?.categoryName || `Category ${index}`}
                className="w-36 h-40 block"
              />
              <p className="text-center mt-2">{category?.categoryName}</p>
            </div>
          </Link>
        ))}
      </div>

      {isHovered && (
        <button
          className="absolute right-0 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full cursor-pointer text-2xl"
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length)}
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default Test;