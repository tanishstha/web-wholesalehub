import React, { useEffect, useState } from 'react'
import "./Navbar.scss"
import { Link } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearchOutline } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { useCart } from '../context/cartContext'
import Search from './Search';
import { useAuth } from '../context/AuthContext';
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
// import {}

const Navbar = ({theme, changeTheme}) => {

  const {isAuthenticated, logout} = useAuth();
  const [isSearchOpen, setSearchOpen] = useState(false);

  console.log("the theme status is: ", theme);

  useEffect(() => {
    if(isSearchOpen) {
      document.querySelector('.search__input__').focus();
    }
    const handleKeyDown = (e) => {
      if(e.key === "Escape") closeSearch();
    };

    window.addEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // useEffect(() => {
  //   if(isSearchOpen) {

  //   }
  // }, isSearchOpen);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const { cartItemCount } = useCart();
  return (
    <>
    <header>
      <nav>
        <div className='hamburger__menu'><Link to=""><GiHamburgerMenu siuze={30}/></Link></div>
        <ul className='nav__elements'>
          <li className='nav__single'><Link to="..">Home</Link> </li>

          <li className='nav__single'><Link to="" >About Us</Link></li>
          <li className='nav__single'><Link to="/products">shop</Link></li>


          {/* <li className='nav__single'><Link to="">unisex</Link></li> */}

          <li className='nav__single'><Link to="..">
          <img src="/assets/images/logo-commerce.jpg" alt="" /></Link></li>
            
          <li className='nav__single'><Link to="/products">New arrivals</Link></li>
          <li className='nav__single'><Link to="">Contact</Link></li>
          <li className='nav__single'>
              {isAuthenticated ? <span className='nav__single'>my account</span> : <Link to='loginSto'> login </Link>}  

              {isAuthenticated ? <ul className='sub__menu'>
                <li className='nav__single sub__nav'>
                  <Link to='/dashboard'>Dashboard</Link>
                </li>
                <li className='nav__single sub__nav'>
                  <button onClick={logout}>Log Out</button>  
                </li> 
              </ul> : null}
              
            </li>
        </ul>

        <ul className='search__login__utility'>
            <li className='item__utility search'>
              <button onClick={openSearch} className='btn__nav__search'><IoSearchOutline size={30}/></button>
            </li>

            <li className='item__utility cart'>
              <Link to="/Cart"><LuShoppingCart size={30}/>
                <div className='cart__count'>
                  {cartItemCount}
                </div>
              </Link>
            </li>
            <li className='nav__single sub__nav'>
              {theme === "light" ? <MdDarkMode size={30} onClick={changeTheme} />: <MdLightMode size={30} onClick={changeTheme} />  }
            </li>
        </ul>

        {isSearchOpen && <Search closeModal={closeSearch}/>}

      </nav>
      </header>
    </>
  )
}

export default Navbar