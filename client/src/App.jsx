import react, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Products from './components/Products';
import { Outlet } from 'react-router-dom';
import { useThemeContext, ThemeProvider } from './context/ThemeContext';

import { useMatches, Link } from 'react-router-dom';

import { useCart, CartProvider } from './context/cartContext';
import ScrollToTop from './context/ScrollToTop';



function AppContent() {
    const {theme, toggleTheme}  = useThemeContext();
    console.log('dark mode: ::::: >>' , theme);

    const [categories, setCategories] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const getAllProducts = async () => {
      try {
        const { data } = await axios.get('/api/v1/product/get-product');
        setCategories(data.products);
        setIsLoaded(true);

        console.log(data.products);
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      getAllProducts();
    },[]);

     
    const matches = useMatches();

    const crumbs = matches
      .filter(match => match.handle && match.handle.breadcrumb)
      .map((match, index) => (
        <span key={match.pathname}>
          <Link to={match.pathname}>{match.handle.breadcrumb}</Link>
          {index < matches.length - 1 && ' > '}
        </span>
      ));

  return (
    <>
      {/* Homepage
      <div>
        <ul>
         {categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>  
      </div>       */}
      <ScrollToTop>
        <Navbar theme={theme} changeTheme={toggleTheme}/>
          <main>
            <Outlet />
          </main>
        <Footer/>
      </ScrollToTop>

    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent/>
    </ThemeProvider>
  )
}

export default App;








// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {createBrowserRouter, RouterProvider} from "react-router-dom";

// const App = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [isLoaded, setIsLoaded] = useState(false);
 
//   const getAllProducts = async () => {
//     try {
//       const { data } = await axios.get('/api/v1/product/get-product');
//       setProducts(data.products);
//       setIsLoaded(true);
//     } catch (err) {
//       console.log(err);
//     }
//   };
  
  
//   useEffect(() => {
//     getAllProducts();
//   }, []);

  
//   return (
//      <>
//       <div className='offer'>
//         <h4><strong>MONSOON SALE! 20% OFF ON ALL APPARELS</strong></h4>
//       </div>
//       <div className='offer'>
//         <h4><strong>This Month we will be contributing 5% of our profits to charity, orphanage and old age homes.</strong></h4>
//       </div>
//       <div className={`fullprod ${isLoaded ? 'loaded' : ''}`}>
//         <div className='pcards'>
//           {products?.map((p, index) => (
            
//               <div className="pcard">
//                 <div className="pimg">
//                   <img
//                     src={p.photo}
//                     alt="Product image"
//                     className="default-photo"
//                   />
//                   <img
//                     src={p.photo1}
//                     alt="Product image on hover"
//                     className="hover-photo"
//                   />
//                 </div>
//                 <div className="pdets">
//                   <h4><strong>{p.name}</strong></h4>
//                   <p className='priceofdetail'><s>Rs.{p.price + 200}.-</s> <strong>Rs.{p.price}/-</strong></p>
//                 </div>
//               </div>
//           ))}
//         </div>
//       </div>
//       </>
//   );
// };


// export default App;