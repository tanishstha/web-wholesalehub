import React from 'react';
import { BiInfinite } from 'react-icons/bi';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './heroLanding.scss';
import landingphoto2 from "../assets/landingphoto2.jpg"

// function SampleNextArrow(props) {
//     const { className, style, onClick } = props;
//     return (
//       <div
//         className={className}
//         style={{ ...style, display: "block", background: "red" }}
//         onClick={onClick}
//       />
//     );
//   }
  
//   function SamplePrevArrow(props) {
//     const { className, style, onClick } = props;
//     return (
//       <div
//         className={className}
//         style={{ ...style, display: "block", background: "green" }}
//         onClick={onClick}
//       />
//     );
//   }

const HeroLanding = () => {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            // nextArrow: (
            //     <div>
            //       <div className="next-slick-arrow">
            //           <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
            //       </div>
            //     </div>
            //   ),
          
            // prevArrow: (
            // <div>
            //     <div className="next-slick-arrow rotate-180">
            //         <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
            //     </div>
            // </div>
            // ),
    }
  return (
    <>
        <div className='hero__section'>
        <div className="slider-container">
            <Slider {...settings}>
                <div>
                <img src="/assets/images/hero.jpg" alt="" />
                </div>
                <div>
                <img src="/assets/images/landingpage.jpg" alt="" />
                </div>
                <div>
                <img src={landingphoto2} alt="" />
                </div>
              
            </Slider>
            </div>
        </div>
    </>
  )
}

export default HeroLanding