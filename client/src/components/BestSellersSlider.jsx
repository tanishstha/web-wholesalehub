import React,{useState,useEffect} from "react";
import Slider from "react-slick";
import "./bestsellerslider.scss";
import SingleCard from "./SingleCard";

const BestSellersSlider = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    // Retrieve data from localStorage
    const apiData = JSON.parse(localStorage.getItem("apiData"));

    if (apiData) {
      // Set the state with the fetched data
      setBestSellers(apiData.slice(0, 6));
    }
  }, []);
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite loop
    speed: 500, // Transition speed
    slidesToShow: 4, // Number of slides shown at once
    slidesToScroll: 1, // Number of slides to scroll
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3, 
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, 
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, 
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="best-sellers-slider w-80">
   <div className="section__padding ">
    <h2>Best Sellers</h2>
    <Slider {...settings}>
      {bestSellers.map((product) => (
        // <SingleCard productId={product._id} productName={product.name} productPhoto={product.photo} productPrice={product.price} />
        <div key={product._id} className="product-card">
          <img src={product.photo} alt={product.name} className="product-image" />
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">रु{product.price}</p>
          </div>
        </div>
      ))}
    </Slider>
    </div>
  </div>
  );
};

export default BestSellersSlider;
