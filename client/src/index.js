import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import HeroLanding from './components/HeroLanding';
import Products from './components/Products';
import SingleProduct from './components/SingleProduct';
import reportWebVitals from './reportWebVitals';
import NotFuond from './NotFuond';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/cartContext';
import Carts from './components/Carts';
import Search from './components/Search';
import SearchResults from './components/SearchResults';
import LoginSto from './components/LoginSto';
import { WishListProvider } from './context/WishListContext';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import { SkeletonTheme } from 'react-loading-skeleton';
import ScrollToTop from './context/ScrollToTop';
import Notification from './components/Notification';
import { NotificationProvider } from './context/NotificationContext';
import Checkout from './components/Checkout';
import { OrderContextProvider } from './context/OrderContext';
import ThreeProductLinks from './components/ThreeProductLinks';
import BestSellersSlider from './components/BestSellersSlider';
import SaleBanner from './components/SaleBanner';

// import Notification from './components/Notification';
// import 

const ProductsWrapper = () => {
  const [products, setProdcuts] = useState([]);
}

const router = createBrowserRouter([
  {
      path: '/',
      element: <App />, 
      errorElement: <NotFuond/>,
      children : [
        {
          path: "/",
          element: (
            <>
              <HeroLanding/>
              <ThreeProductLinks/>
              <BestSellersSlider/>
              <SaleBanner/>
              {/* <Products/> */}
            </>
          ),
        },
        {
          path: 'search-results',
          element: <SearchResults/>,
        },
        // {
        //   path: 'search',
        //   element: <Search/>,
        // },

        {
          path: 'loginSto',
          element: <LoginSto/>,
        },
        {
          path: 'product/:productId',
          element: <SingleProduct />,
        },
        {
          path: 'cart',
          element: <Carts/>
        },
        {
          path : 'dashboard',
          element: <Dashboard/>,
        },
        {
          path: 'checkout',
          element: <Checkout/>
        },
        {
          path: 'products',
          element: <Products/ >
        },

       
      ]

  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NotificationProvider>
    <SkeletonTheme baseColor='#898989' highlightColor='#9a9a9a'>
        <AuthProvider>
            <WishListProvider>
              <OrderContextProvider>
              <CartProvider>
                <RouterProvider router={router}/>
              </CartProvider>
            </OrderContextProvider>
            </WishListProvider>
        </AuthProvider>
    </SkeletonTheme>
    <Notification/>
    </NotificationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
