import React from 'react';
import './salebanner.scss';
import salebanner from "../assets/salebanner.png"
import { Link } from 'react-router-dom';

const SaleBanner = () => {
  return (
    <div className="sale-banner-container w-80">
      
      {/* Left Section - Placeholder for Image */}
      <div className="image-container">
        {/* Placeholder for the image */}
        <img src={salebanner} alt="Product" className="placeholder-image" />
      </div>

      {/* Right Section - Content */}
      <div className="content-container">
        <h1 className="sale-title">SALE SALE SALE!!!</h1>
        <p className="sale-description">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        </p>
        <Link to="/products" >     
        <button className="btn__main">Open Catalog</button></Link>
      </div>
    </div>
  );
};

export default SaleBanner;
