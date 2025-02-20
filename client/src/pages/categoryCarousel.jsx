import React, { useState } from 'react';
import img from '../assets/products/mouse/ASUS Marshmallow - Silent, Adj. DPI, Multi-Mode, With Solar Cover Wireless Optical Mouse (2.4GHz Wireless, Bluetooth, Quiet Blue) 1.webp';
import img1 from '../assets/products/mouse/ASUS Marshmallow - Silent, Adj. DPI, Multi-Mode, With Solar Cover Wireless Optical Mouse (2.4GHz Wireless, Bluetooth, Quiet Blue) 1.webp';
import img2 from '../assets/products/mouse/ASUS Marshmallow - Silent, Adj. DPI, Multi-Mode, With Solar Cover Wireless Optical Mouse (2.4GHz Wireless, Bluetooth, Quiet Blue) 1.webp';

const CategoryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [img, img1, img2]; // Array of images for the carousel

  // Function to move to the previous image
  const movePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Function to move to the next image
  const moveNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div>
      <div className="carousel my-12 mx-auto">
        <h2 className="text-4xl leading-8 font-semibold mb-12 text-slate-700">Our epic carousel</h2>
        <div className="relative overflow-hidden">
          <div className="flex justify-between absolute top-0 left-0 w-full h-full">
            <button
              onClick={movePrev}
              className="hover:bg-blue-900/75 text-white w-10 h-full text-center opacity-75 hover:opacity-100 z-10 p-0 m-0 transition-all ease-in-out duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-20 -ml-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="sr-only">Prev</span>
            </button>
            <button
              onClick={moveNext}
              className="hover:bg-blue-900/75 text-white w-10 h-full text-center opacity-75 hover:opacity-100 z-10 p-0 m-0 transition-all ease-in-out duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-20 -ml-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="sr-only">Next</span>
            </button>
          </div>
          <div className="carousel-container relative flex gap-1 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0">
            {images.map((image, index) => {
              return (
                <div
                  key={index}
                  className={`carousel-item text-center relative w-64 h-64 snap-start ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transition: 'opacity 0.5s ease-in-out' }}
                >
                  <a href="#" className="h-full w-full aspect-square block bg-origin-padding bg-left-top bg-cover bg-no-repeat z-0" style={{ backgroundImage: `url(${image})` }}>
                    <img src={image} alt={`Carousel Image ${index + 1}`} className="w-full aspect-square hidden" />
                  </a>
                  <a href="#" className="h-full w-full aspect-square block absolute top-0 left-0 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-blue-800/75 z-10">
                    <h3 className="text-white py-6 px-3 mx-auto text-xl">Image {index + 1}</h3>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
