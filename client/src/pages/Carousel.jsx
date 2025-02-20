import React from 'react';
import { Carousel } from 'antd';
import img1 from '../assets/banner/img1.webp';
import img2 from '../assets/banner/img2.webp';
import img3 from '../assets/banner/img3_mobile.jpg';
import img4 from '../assets/banner/img4_mobile.jpg';

const CarouselCreate = () => {
  const images = [img1, img2, img3, img4];

  return (
    <Carousel autoplay autoplaySpeed={5000} dots={true} effect="fade">
      {images.map((img, index) => (
        <div key={index} className="h-[300px] md:h-[500px] w-full">
          <img
            src={img}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselCreate;
