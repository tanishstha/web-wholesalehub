import React, { useState, useRef, useEffect } from 'react'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCart } from '../context/cartContext';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'



const DetailsSlider = ({images, colors, onColorChange, pickedColor, loading}) => {

    // console.log(images[0].url);

    const [filteredImages, setFilteredImages] = useState(images.length > 0 ? [images[0]] : []);

    // console.log('the filtered images has: ' + JSON.stringify(filteredImages));
   
    const[selectedColor, setSelectedColor] = useState(colors[0].color);
    const[mainImages, setmainImages] = useState(images[0]?.url);

    const mainSliderRef = useRef(null);
    const thumbSliderRef = useRef(null);

    //accessing the cart context
    const {addItemToCart, cartItems} = useCart();

    //update filtered images whenever pickedColor changes
    useEffect(() => {

        // filter image by selected color and associated id
        if(pickedColor) {
            const filtered = images.filter(image => image.id === pickedColor._id);
            setFilteredImages(filtered.length > 0 ? filtered : [images[0]]);
            // console.log("the filteres image is" + JSON.stringify(filtered));

            if(filtered.length > 0) {
                setmainImages(filtered[0]);
            }
        }
    },[pickedColor]);

    const handleAddtoCart = () => {
        if(filteredImages) {
            //prepate item data for cart
            const itemToAdd = {
                image: filteredImages,
            };

            addItemToCart(itemToAdd);
            alert('item added to cartt');
        }
    
    }

    //updating images when the colors changes
    // const handleColorChange = (color) => {
    //     setSelectedColor(color);
    //     setmainImages(images);
    // };

    //slider settings for main slider
    const mainSliderSettings = {
        infinite: false,
        slidesToShow: 1,
        slideToScroll: 1,
        asNavFor: thumbSliderRef.current,
        ref: mainSliderRef,
        arrows: false,
        dots: false,
    };

    //slider settings for thumbs slider
    const thumbSliderSettings = {
        infinite: false,
        // asNavFor: mainSliderRef.current,
        // ref: thumbSliderRef,
        slidesToShow: 6,
        swipeToSlider: true,
        focutOnSelect: true,
    };

    //custom paging solution
    // const settings = {
    //     customPaging: function(i) {
    //         return (
    //             <a>
    //                 <img src={images[i].url} alt={`Thumbnail ${i + 1}` } id={images[i].id}/>
    //             </a>
    //         );
        
    //     },
    //     dots: true,
    //     dotsClass: "slick-dots click-thumb",
    //     infinite: true,
    //     speed: 500,
    //     slideToShow: 1,
    //     slideToScroll: 1,

    // }

    

    return (
        <>
            <Slider {...mainSliderSettings}>
                {filteredImages.map((image, index) => (
                    <div key={index}>
                        <img src={image.url} alt={`Main view ${index}`} />
                    </div>
                ))}
            </Slider>
            {/* slider with custom paging function */}
            <div className='slider-container slick__thumbs'>
                <Slider {...thumbSliderSettings}>
                    {images.map((image, index) => 
                    {
                        return (<div key={index}>
                            {loading ?  <Skeleton /> :  <img src={image.url} alt={`thumbnail view ${index.url}`} id={image.id} onClick={() => setFilteredImages([image])}/>}
                            
                        </div>)
                    })}
                </Slider>
            </div>
        </>
    )

}

export default DetailsSlider