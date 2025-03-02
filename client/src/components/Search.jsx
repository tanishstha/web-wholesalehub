import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import "./search.scss";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const Search = ({closeModal}) => {

    const[query, setQuery] = useState("");
    const navigate = useNavigate();

    // holds result of search operation
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);

        //navigate to search results page with query as state
        navigate("/search-results", {state:{query}});
        closeModal();
        //make product filter or implement API search logic
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            handleSearch(e);
        }
    }
  return (
    <>
        <div className='search__modal'>
            <div className='modal__content'>
                <div className='pattern'></div>
                <button className='close__modal' onClick={closeModal}>
                <IoMdClose size={60}/>
                </button>

                <div className='search__bar'>
                    <input type="text" className='search__input__' placeholder="Search for Products..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyPress}/>

                    <button type='' onClick={handleSearch} className='btn__search'>
                        <IoSearchOutline size={45}/>
                    </button>
                </div>

                <p className='guide__text'>search for products by name or category</p>
            </div>
        </div>
    </>
  )
}

export default Search