import React, { useEffect, useState } from 'react'
import './products.scss'
import ModalImage from "react-modal-image";
import { HiMiniMagnifyingGlassPlus } from "react-icons/hi2";
import { MdOutlinePhotoSizeSelectLarge } from "react-icons/md";
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const SingleCard = ({productId, productName, productPhoto, productPrice, onLoad, loading, details, toggleView , colors}) => {

    const [isImageLoaded, setIsImageLoaded] = useState(false);
    
    //controls fi the modal is shown
    const [isModalOpen, setIsModalOpen] = useState(false); 

    //stores the selected image for modal
    const [selectedImage, setSelectedimage] = useState(null);

    const handleImageClick=(imageUrl) => {
        setSelectedimage(imageUrl);
        setIsModalOpen(true);
    }

    const closeModal =() => {
        setIsModalOpen(false);
        setSelectedimage(null);
    }

    useEffect(() => {
        const handleEscape = (e) => {
            if(e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        //add event listerenr for event key
        document.addEventListener('keydown', handleEscape);

        return() => {
            document.removeEventListener('keydown', handleEscape);
        }
    },[isModalOpen])


    const handleImageLoad = () => {
        console.log('handleaImage function was triggered');
        setIsImageLoaded(true)
    }

  return (
    <>
         <motion.li initial={{opacity: 0}} animate={{opacity: 1}}   transition={{
        opacity: {
            duration: 0.5,    // Transition time in seconds
            ease: "easeInOut"  // Easing function for smooth effect
        }
        }} className='single__product' key={productId}>
            <div className='products__card'>
                {/* {!isImageLoaded && loading  && <Skeleton  width={325} height={450}/> } */}
                <Link to={`/product/${productId}`}> 
                    <img
                        src={productPhoto}
                        alt={`Product image ${productName}`}
                        className="product-image"
                        loading='lazy'
                    />
                </Link>
               
                {/* <ModalImage small={productPhoto}
                large={productPhoto} src={productPhoto} alt={productName} onLoad={handleImageLoad} className="modal-image" loading="lazy"> */}

                <div className='search__button'>
                    <button onClick={() => handleImageClick(productPhoto)} className='zoom_btn'>
                        <HiMiniMagnifyingGlassPlus size={30}/>
                    </button>
                </div>
                
                {/* </ModalImage> */}


                {isModalOpen && selectedImage && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeModal}>
                                ✖
                            </button>
                            <ModalImage
                            small={selectedImage}  // Small image for thumbnail
                            large={selectedImage}  // Large image for modal view
                            alt="Product image"
                            onClose={closeModal}  // Close modal on close action
                            />
                        </div>
                    </div>
                )}

                <div className='arrange__colwise'>
                    <div>
                            <Link to={`/product/${productId}`}> 
                                <h6 className='product__name'>{productName}</h6>
                            </Link>
                            {toggleView ? 
                            
                            <div>
                                <ul className='list__details'>
                                    {details.split("\r\n").slice(0, 7).map((line, index) => (
                                        <li key={index} className='list__item__details'>{line.trim()}</li>
                                    ))}
                                </ul>


                                <p>{details}</p> 
                                <div className='avail__colors'>
                                    {colors.map((color, index) => (
                                    <span key={index} className='color__choice' style={{background: color.color, position: 'relative'}} 
                                        
                                    ></span>

                                    ))}
                                </div>
                            </div>
                            
                            
                            : null}

                        <p className='product__price'>रू{productPrice || <Skeleton/>}</p>
                    </div>

                    {toggleView ? 

                        <Link to={`/product/${productId}`} > 
                        <Button classes="btn__main" buttonText="View Product" /> </Link> : null
                        
                    }           
                </div>
            </div>
        </motion.li>
    </>
  )
}

export default SingleCard