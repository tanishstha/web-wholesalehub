import React from 'react';
import './threeproductlinks.scss';
import sneakers from "../assets/sneakers.png"
import boots from "../assets/boots.png"
import sports from "../assets/sports.jpeg"
import { Link } from 'react-router-dom';


const categories = [
  {
    title: "Sneakers",
    description: "Life is better in sneakers.",
    link: "/sneakers",
    image: sneakers, 
    bgColor: "white",
  },
  {
    title: "Boots",
    description: "Leave the road, take the trails.",
    link: "/boots",
    image: boots, 
    bgColor: "white",
  },
  {
    title: "Sports",
    description: "Worry less, run more.",
    link: "/sports",
    image: sports,
    bgColor: "white",
  },
];

const ThreeProductLinks = () => {
    return (
        <div className="category-section">
          {categories.map((category, index) => (
            <div
              className="category-card"
              key={index}
              style={{ backgroundColor: category.bgColor }}
            >
              <div className="category-image">
                <img src={category.image} alt={category.title} />
              </div>
              <div className="category-text">
                <h2>{category.title}</h2>
                <p>{category.description}</p>
               <Link to='/products' > <button className='btn__main'> 
                  Shop Now
                </button></Link>
              </div>
            </div>
          ))}
        </div>
      );
};

export default ThreeProductLinks;
