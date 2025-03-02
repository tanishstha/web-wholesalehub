import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useParams } from 'react-router-dom';
// import Slider from "react-slick";
import { FaCheckSquare } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/cartContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { useWishlist } from '../context/WishListContext.jsx';
import DetailsSlider from './DetailsSlider.jsx';
import "./singleProduct.scss";


const SingleProduct = () => {
    const {productId} = useParams();
    const [loading, setLoading] = useState(true);


    //use notification contxt
    const {showNotification} = useNotification();

    //show more and show less for product description
    const [heightActivated, setHeightActivated] = useState(false);

    const descriptionRef = useRef(null);

    //handle and control height of product description
    const handleContentHeight = () => {
        setHeightActivated (prevState => {
            if(prevState) {
                descriptionRef.current.scrollIntoView({behavior: 'smooth', block:'start'});
            }

            return !prevState;
        }) ;

        console.log('descriptionRef:', descriptionRef.current);
    }
    
    // console.log("params:" + (productId) );

    //selectedProducts will hold the product information that comes after color is selected
    const [selectedProduct, setSelectedProduct ] = useState(null);

    //state to handle quantity initialized to 1
    const [Quantity, setQuantity] = useState(10);

    const [Discount, setDiscount] = useState(5);

    //state to manage wisth list
    const {wishlist, setWishlist, handleWishlist} = useWishlist();

    const {isAuthenticated, setisAuthenticated, validateToken, logout} = useAuth();

    //check if selected product is in wishlist
    const [isInWishlist, setIsInWishlist] = useState(() => 
        {if(isAuthenticated) {
            return (wishlist ? wishlist.some((wishListItem) => wishListItem.id === productId) : false)
        } else {
            console.log('user not logged in');
            return false;
        }
    });

    console.log('isInWishlist: ' + isInWishlist);

    useEffect(() => {
        if(isAuthenticated) {
            const inWishlist = (wishlist ? wishlist.some((wishListItem) => wishListItem.id === productId) : false)
            setIsInWishlist(inWishlist);
        } else {
            console.log('user not logged in');
            setIsInWishlist(false);
        }
    },[wishlist]);
 
    // function to add and item to wishlist
    const addToWishlist = () => {

        validateToken();

        if(isAuthenticated) {
            if(selectedProduct) {
                //prepate item data for cart
                const itemToAdd = {
                    id: selectedProduct._id,
                    title: selectedProduct.name,
                    // image: photos[0]?.url,
                    color: selectedColor,
                    price: selectedProduct.price,
                    Quantity,
                };

                handleWishlist(itemToAdd);
                // showNotification('Products added to wishlist', 'success');
                // const exists = wishlist.some((wishListItem) => wishListItem.id === itemToAdd.id);
    
                // if(exists) {
                //     setWishlist(wishlist.filter((wisthListItem) => wisthListItem.id !== itemToAdd.id ));
                // } else {
                //     setWishlist([...wishlist, itemToAdd]);
    
                // }
    
                // console.log('the wishlist context has: ' + JSON.stringify(wishlist, null, 2));
            }
        } else {
            showNotification('loin to use wishlist', 'rejection');
        }

        
    }

    // get category of the product
    const [productCat, setProductCat] = useState();

    //similar products section
    const [similarProducts, setSimilarProducts] = useState();

    // useEffect(() => {
    //     console.log("the product catergory obtained is: " + productCat);

    // }, [productCat]);
   
    const [colors, setColors] = useState([]);

    const[colorSelect, setColorSelect] = useState(false);
    // console.log(colorSelect);
    //photos variable has all the photos from the api photo as well as from the colors option
    const [photos, setPhotos]=useState([]);
    // useEffect(() => {
    //     console.log('the photos vairable has this photo=====> ' + JSON.stringify(photos));
    // },photos)
    const [selectedColor, setSelectedColor] = useState(null);
    // console.log('the seelctedColor has: ' + JSON.stringify(selectedColor));


    //accessing the cart context
    const {addItemToCart, cartItems} = useCart();
    const [description, setDescription] = useState(null);

    const fetchProduct = async() => {
        try {

            setLoading(true);
            setSelectedProduct(null);
            setPhotos([]);
            //fetches all the products data from api
            const{data} = await axios.get(`/api/v1/product/get-product`);

            //filters products by matching id with the gathered data from api
            const result = data.products.filter((item => item._id === productId));

            setProductCat(result[0].category.name);

            const related = data.products.filter((item) => item.category.name === result[0].category.name);

            setSimilarProducts(related);
            

            // console.log('similar produtcts has: ' + JSON.stringify(similarProducts, null, 2));

            // console.log('result from api filter are' + JSON.stringify(result, null ,3));


            if (result.length > 0) {
                setSelectedProduct(result[0]);
                console.log(selectedProduct);

                const fetchedColors = result[0].colors || [];
                setColors(fetchedColors);

                const productPhotos = [
                    {id: 'photo01', url: result[0].photo},
                    {id: 'photo02', url: result[0].photo1},
                    {id: 'photo03', url: result[0].photo2},
                    {id: 'photo04', url: result[0].photo3},
                    {id: 'photo05', url: result[0].photo4},
                    {id: 'photo06', url: result[0].photo5},
                    {id: 'photo07', url: result[0].photo6},
                ].filter(photo => photo.url && photo.url !== "-");

                // collect photos from the single products colors array element
                const productPhotosColors = result[0].colors.map(({link , _id}) => ({id: _id, url: link}));

                const getColors = result[0].colors.map(({color}) => ({color}));

                //collect photos from 
                setPhotos([...productPhotos, ...productPhotosColors]);

            }
       
            else {
                console.log('products not matched');
            }

        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect (() => {
        fetchProduct();
    }, [productId])
   
    useEffect(() => {
        if(selectedProduct && selectedProduct.colors && selectedProduct.colors.length > 0 ) {
            // console.log('the selected products has : ' + JSON.stringify(selectedProduct.colors));
            const getColors = selectedProduct.colors.map((item) => item.color);
            // console.log("getColors has: ------> " + getColors);

            //get individual color
            setSelectedColor(getColors[0]);
            // console.log('the selected color is initialized as'+  selectedColor);
        }

        if(selectedProduct) {
            const fromattedDescription = selectedProduct.description.split('\n');
            setDescription(fromattedDescription);
            console.log(description);
        }
    }, [selectedProduct]);

    function handleIncrement() {
        setQuantity(Quantity + 1)
    }

    function handleDecrement() {
        if (Quantity > 10) {
            setQuantity(Quantity - 1);
        }
    }
    
    const handleColorChange = (color) => {
        setSelectedColor(color);
        setColorSelect(true);
    }

    const handleButtonClick = () => {
        if(!colorSelect) {
            alert('please select a color first!');
        }
    }    
    // useEffect(() => {
    //     console.log('the selected color is: ' + selectedColor);
    // }, [selectedColor]);
    
    // if(loading) return <p>loading...</p>


    const handleAddToCart = () => {
        if(!colorSelect) {
            alert('please select a color first');
        }
        if(selectedProduct) {
            //prepate item data for cart
            const itemToAdd = {
                id: selectedProduct._id,
                title: selectedProduct.name,
                // image: photos[0]?.url,
                color: selectedColor,
                price: selectedProduct.price,
                Quantity,
            };

            addItemToCart(itemToAdd);
            alert('item added to cartt');
        }
    } 
    // console.log( 'the cart items are: ' + JSON.stringify(cartItems, null, 2));

    return (
        <>
            {selectedProduct && 
            
            (<div className='products__wrapper w-80 section__padding' key={selectedProduct._id}>
                <div className="spacer"></div>
                <div className='products__details__wrapper'>
                    <div className='left_item details__child '>
                            <figure>
                                {loading ? 
                                
                                (<Skeleton height={400}/>) : 
                                (
                                    <DetailsSlider loading={loading} images={photos} pickedColor= {selectedColor} colors={colors} onColorChange={handleColorChange}/>

                                )
                                
                                }
                            
                            </figure>
                    </div>

                    <div className='right_item details__child'>
                        <h1 className='product__title'>{ loading ?  <Skeleton/> : selectedProduct.name}</h1>
                        <div className='quantity'>
                            <p>Minimum Quantity</p>
                            <div className='quantity__counter'>
                                <button className='decrement' onClick={handleDecrement}>-</button>
                                <span className='quantity__state'>{Quantity}</span>
                                <button className='increment' onClick={handleIncrement}>+</button>
                            </div>
                        </div>
                        {/* <div className='sizes'></div> */}
                        {/* <p>{selectedProduct.description}</p> */}

                        {/* handle color change in products details page */}
                        <div className='color__selector'>
                            <p>Available Colors</p>
                            {selectedProduct.colors.map((colorHead, index) => (
                                <span key={index} className='color__choice' style={{background: colorHead.color, position: 'relative', border: '2px solid white'}} id={colorHead._id}
                                    onClick = {() => handleColorChange(colorHead)}

                                    
                                >
                                    {/* // show check icon only if this color is selected */}
                                    {colorSelect && selectedColor._id === colorHead._id && (
                                        <FaCheckSquare 
                                            style={{
                                                position: 'absolute',
                                                zIndex: '1',
                                                bottom: '0',
                                                left: '0',
                                                // transform: 'translate(-50%, -50%)',
                                                color: 'white',
                                            }}
                                        />
                                    )} 
                                </span>
                            ))}
                          
                        </div>

                        <div className="wrapper__price__wishlist">
                            <div className='wrapper__na'>
                                <div className='price__products'>
                                रु{loading?  <Skeleton/> : selectedProduct.price }
                                </div>

                                <div className='offered__discount'>
                                    {loading ? <Skeleton width={100}/> :  
                                    (
                                        <>
                                            25% discount , <span className='old__price'>रु{(selectedProduct.price)*0.25 + (selectedProduct.price) }</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className='wrapper__wishlist'>
                                <div className='wishlist'>
                                    {/* <div className='suggestion__text'>
                                        { wishlist ? (wishlist.some((wishListItem) => wishListItem.id === productId) ? <div> Remove Item from Cart</div> : <div>Add Item to Cart</div>) : <div> Remove Item from Cart</div>}
                                    </div> */}

                                    <button  disabled={!colorSelect} className="button__wishlist"  onClick={addToWishlist}>
                                        {isInWishlist ? <FaHeart  size={20}/> : <FaRegHeart  size={20}/>}
                                            
                                            
                                    </button>
                                    <span className='alert__text'>please select a color!!</span>
                                </div>
                            </div>
                        </div>

                        <div className='btn__grp' onClick={handleButtonClick}>
                            <button disabled={!colorSelect} className='btn__main' onClick={handleAddToCart}>add to cart</button>
                            <span className='alert__text'>please select a color!!</span>
                            <button className='btn__main'>buy now</button>
                        </div>

                     
                    </div>

                    <div ref={descriptionRef} className='product__description w-100 details__child'>
                        <h3>Description </h3>

                        <ul className='details__list'>
                            {description && description.map((item, index) => (
                                <li className='description__single' key={index}>{item}</li>
                            ))}
                        </ul>

                        <div className={`image__description  ${heightActivated ? 'show_full' : 'show_default'} `}>
                            {photos.map((item) => <img key={item.id} className='image__description__single' src={item.url} alt={`${selectedProduct.title} description`}></img>)}

                            <div className={`text__center class__button`}>
                                <button className='btn__light' onClick={handleContentHeight}>{heightActivated ? 'show less' : 'show more'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}


            <div className='similar__products__section products__wrapper w-80 section__padding'>
                <h1>Simliar Products</h1>
                {
                    similarProducts && 

                    <ul className="products__list">
                            {/* sort the filtered products list afte the selectionis made */}
                            {similarProducts.slice(0, 4).map((product) => 
                            (
                                <li className='single__product' key={product._id}>
                                    <div className='products__card'>
                                        <img src={product.photo} alt={product.name} />


                                        <Link to={`/product/${product._id}`} key={product._id} >
                                            <h6 className='product__name'>{product.name}</h6>
                                        </Link>
                                        
                                        <p className='product__price'>रू{product.price}</p>
                                    </div>
                                </li>
                            ))

                            }
                        </ul>
                }
            </div>
        </>
  )
}

export default SingleProduct