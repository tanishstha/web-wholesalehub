import React, { useEffect, useState } from 'react'
import './products.scss'
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import {ScaleLoader} from 'react-spinners';
// import ImagePopup from './ImagePopup';
// import SingleProduct from './SingleProduct';
import SingleCard from './SingleCard';
import { IoGridOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import {motion} from 'framer-motion';


const CACHE_DURATION = 24*60*60*1000;  //1 day or 24 Hours

const Products = () => {
    const [data, setData] = useState([]);

    //products state variable is populated with products information from api
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState('');
    const [loading, setLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const itemPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    console.log(`the has more status has ${hasMore}`);

    const [isFullWidthView, setIsFullWidthView] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    //inisitalize products with 'all'
    const [category, setCategory] = useState(['all']);

    //state to track selected cateroy started with value of 'all'
    const [selectedCategory, setSelectedCategory] = useState('all');

    
    // sorting functions in acending order
    const sortPriceAsc = () => {
        const sortedProducts = [...data].sort((a,b) => a.price - b.price);
        setData(sortedProducts);
    }
    // sorting functions in descending order

    const sortPriceDesc = () => {
        const sortedProducts = [...data].sort((a,b) => b.price - a.price);
        setData(sortedProducts);
    }

    // sorting functions in alphabetical order (a-z)

    const sortAphabeticalZA = () => {
        const sortedProducts = [...data].sort((a,b) => a.name.localeCompare(b.name));
        setData(sortedProducts);
    }

    // sorting functions in alphabetical order (z-a)
    const sortAlphabeticalAZ = () => {
        const sortedProducts = [...data].sort((a,b) => b.name.localeCompare(a.name));
        setData(sortedProducts);
    }

    // filtering products base on category
    // const filterCat= () => {
    //     const catFiltered = [...products].filter(product => )
    // }


    //get all the products form API
    const getAllProducts = async () => {
        setLoading(true);

        try {
            const{data} = await axios.get('/api/v1/product/get-product');
            // console.log('the structure with data.products is: ' + JSON.stringify(data.products, null, 2));
            setProducts(data.products);

            // console.log('the products has: ' + JSON.stringify(products));

            //save products in localstorage for faster loading time
            localStorage.setItem('apiData', JSON.stringify(data.products));


            // setDisplayedProducts(JSON.parse(localStorage.getItem('apiDate')).slice(0, itemPerPage));

            //create a timestampt to use it later to refetch in a certai interval
            localStorage.setItem('fetchTime', Date.now().toString());

            // console.log("the data store in localstorage is: " + localStorage.apiData);
            // console.log(data.products);

        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

   

    
    //get all teh categories form API
    const getCategory = async() => {
        try {
            const {data} = await axios.get('/api/v1/category/get-category');
            const categoryNames = data.category.map(category => category.name);
            // console.log("the category names are: " + categoryNames);

            //this code for setCategory replaces category to the category state
            setCategory(prevCategory => {
                // console.log("the prev value is:"  + prevCategory)
                return ['all', ...categoryNames];
            });
            
            // console.log("hte category state has thsese value: " + category);

        } catch(error) {
            console.log(error);
        } 

        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllProducts();
        getCategory();
    }, []);



    // display products from localstorage instead of api fetch
    useEffect(() => { 

        //get cahed data and custom fetch timestamp from localstorage
        const cachedData = JSON.parse(localStorage.getItem('apiData'));
        const cachedTimeStamp = localStorage.getItem('fetchTime');

        
        if(cachedData && cachedTimeStamp) {
            const isCacheValid = Date.now() - parseInt(cachedTimeStamp, 10) < CACHE_DURATION;
            console.log('the cache status is: ' + isCacheValid);
            
            if(isCacheValid) {
                //use cached data if still valid
                // setData(cachedData);
                //initially show only 12 products or whatever value "itemPerPage" has
                setData(cachedData.slice(0, itemPerPage));
                setDisplayedProducts(itemPerPage);

                setLoading(false);

            } else {
                //cache expired, fetch new data
                getAllProducts();
            }
        }
    },[])


     //function to load more products when button is clikced
     const loadMoreProducts = () => {
        const cachedData = JSON.parse(localStorage.getItem('apiData'));
        const nextPage = cachedData.slice(itemPerPage, itemPerPage + itemPerPage)

        setData((prevData) => [...prevData, ...nextPage]);

        //if we have displayed all the products hide "load more"  button
        console.log(`the length of data is ${data.lenght} and lenght of displayed products is ${displayedProducts}`)
        if(displayedProducts  >= data.length ) {
            setHasMore(false);
        }

        setCurrentPage(nextPage);

       
    }

    useEffect(() => {
        console.log('updated data: ' + data);
    }, [data]);

    useEffect (() => {
        if(imagesLoaded === products.length && products.length > 0) {
            setLoading(false)
        }
    }, [imagesLoaded, products.length]);

    const handleImageLoad = () => {
        setImagesLoaded((prevCount) => prevCount + 1);
    }

    
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    }

    // useEffect(() => {
    //     console.log(selectedCategory)
    // }, [selectedCategory])


    const filteredProducts = selectedCategory === 'all' ? data : data.filter(
        product => {
            // console.log('selected category name is:', selectedCategory);
            return product.category?.name?.toLowerCase() === selectedCategory;
        } 
        
    );
    // console.log('the filtered products is: ', filteredProducts);
    // console.log( filteredProducts);

    // console.log(products.category.name);
    const [zoomed, setZoomed] = React.useState(false);

    const changeViewFullWidth = () => {
        
        setIsFullWidthView(true);
        setViewMode('grid');
    }

    const normalView = () => {
        setIsFullWidthView(false);
        setViewMode('list');
    }

    const handleSortChange = (event) => {
        const selectedOption = event.target.value;

        switch (selectedOption) {
            case 'lowToHigh' :  
                sortPriceAsc();
                break;
            case 'highToLow' :
                sortPriceDesc();
                break;

            case 'nameAZ' :
                sortAlphabeticalAZ();
                break;

            case 'nameZA' :
                sortAphabeticalZA();
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div className="spacer"></div>
            <div className="products__page__wrapper">
                <div className='filter__menu section__padding'>
                    <div className='wrapper__buttons'>
                    
                        <label htmlFor="category__select" className='label__category__selector'>Filter by Category: </label>

                        <select name="" id="category__select" onChange={handleCategoryChange} value={selectedCategory}>
                            {category.map((categoryName, index) => (
                                <option key={index} value={categoryName.toLowerCase()} >{categoryName}</option>
                            ))}
                        </select>
                    </div>
                        
                    <div className='wrapper__buttons'>
                        <label htmlFor="sortOptions" className="sort__label">Sort Products: </label>

                        <select name=""  id="sortOptions" className='sort__select' onChange={handleSortChange}>
                            <option value='' disabled selected>Select an option</option>
                            <option value="lowToHigh">Price Low to High</option>
                            <option value="highToLow">Price High to Low</option>
                            <option value="nameZA">Sort by name A-Z</option>
                            <option value="nameAZ">Sort by name Z-A</option>
                        </select>
                    </div>
                        

                    <div className='wrapper__buttons'>
                        <div className='toggle__view'>
                            <button onClick={changeViewFullWidth} className={`toggle__button  ${viewMode === 'grid' ? 'active' : ''}`}>
                                <CiBoxList size={25}/> List View
                            </button>

                            <button className={`toggle__button ${viewMode === 'list' ? 'active' : ''}`} onClick={normalView}>
                                <IoGridOutline size={25}/> Grid View
                            </button>
                        </div>
                    </div>
                </div>


                <div className=' w-90 section__padding'>
                    {
                        loading ? (
                            <div className="loading__screen">
                                <ScaleLoader color= "orange" size={50}/>
                                <p>Loading Products...</p>
                            </div>
                        ) : 
                        (
                            <motion.ul initial={{opacity: 0}} animate={{opacity: 1}} exit={{ opacity: 0 }} transition={{
                                opacity: {
                                    duration: 0.5,    // Transition time in seconds
                                    ease: "easeInOut",  // Easing function for smooth effect
                                    delay: 0.2
                                }
                            }} className={`products__list ${isFullWidthView ? 'full__width' : 'grid'}`}  >
                                {/* sort the filtered products list afte the selectionis made */}
                                {filteredProducts.map((product) => 
                                (
                                    // the SingleCard component takes productId, productName, productPhoto, productPrice, onLoad as props to function as a single products card
                                    <SingleCard  productId={product._id} key={product._id} productName={product.name} productPhoto={product.photo} productPrice={product.price} onLoad={handleImageLoad} toggleView={isFullWidthView} details={product.description} colors={product.colors} loading={loading}/>

                                ))
                                
                            }
                            {
                                hasMore && (
                                    <button className='btn__main btn__load__more' onClick={loadMoreProducts} disabled={loading}>
                                        {loading ? 'loading...' : 'load More Products'}
                                    </button>
                                )

                            }
                            </motion.ul>
                        )
                    }

                    {/* <Outlet context={{ products }} /> */}

                </div>
            </div>

           
        </>
    )
}

export default Products