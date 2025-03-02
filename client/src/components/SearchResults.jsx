import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import SingleCard from './SingleCard';


const SearchResults = () => {
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [isFullWidth, setIsFullWidth] = useState(true);

    //retirieve query from state
    const query = location.state?.query || "";
    const [results, setResults]  = useState([]);

    //unique kry yo re-trigger search
    const [searchKey, setSearchKey] = useState(0);
    console.log('the query is: ' + query);

    // clear the results state variable after a fixed duration

    //peform search based on query
    useEffect (() => {
      if(!query) {
        return;
      }
      // setResults([]);
      const filteredResults = JSON.parse(localStorage.getItem('apiData')).filter((products)=> {
        const nameMatch = products.name.toLowerCase().includes(query.toLowerCase())
        const categoryMarch = products.category.name.toLowerCase().includes(query.toLowerCase());

        return nameMatch || categoryMarch;
      
      });

      setResults(filteredResults);
      // console.log('the search results has: '  + JSON.stringify(results, null, 2));
      console.log('the search results has: '  + results);
    }, [query, searchKey]);

 
  return (
    <>
      <div className='products__wrapper w-80 section__padding'>
        <div className="spacer"></div>

        <h3>Search results for "{query}" are</h3>
        
        <ul  className={`products__list`} >
          {
            results.length > 0 ? (
            
            results.map((products) => {
              return (
              <SingleCard productId={products._id} productName={products.name} productPhoto={products.photo} productPrice={products.price} />)
            })) : (
              <p>No products found for "{query}"</p>
            )
          }
        </ul>
        {/* <p>location</p> */}
      </div>  
    </>
  )
}

export default SearchResults