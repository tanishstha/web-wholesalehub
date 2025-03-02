import React, {createContext, useState, useContext, useEffect} from 'react';
import { jwtDecrypt, decodeJwt } from 'jose';
import { LiaStreetViewSolid } from 'react-icons/lia';
import { get } from 'mongoose';
import { useNotification } from './NotificationContext';

const WishListContext = createContext();
  

export const WishListProvider = ({children}) => {

  const {showNotification } =useNotification();
  
  // extract user id or in this case email from token stored in local storage
  // }
  const getUserIdFromToken = ()  => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decoded = decodeJwt(token); //decode the token
        // setUserId(decoded.email);
        return decoded.email;

      } catch(error) {
        console.log('error decoding token: ', error);
        return null;
      }
    }

    return null;
  }

  const [userId, setUserId] = useState(getUserIdFromToken());

  const refreshUserId = () => {
    const uerFromToken = getUserIdFromToken();
    setUserId(uerFromToken);
    console.log('new id is: ',  uerFromToken);
  }
  // state to store userId (emil from token)

  //run on mount to fetch userId from token and update state if nevessary
  useEffect(() => {
    const userFromToken = getUserIdFromToken();
    // setUserId(userFromToken)
    console.log("username obtainer from token is ===========>: " +  userFromToken);
  },[userId]);


  // console.log("the user id obtained is: " + JSON.stringify(userId));


  //wishlist state variable has data from localstorage according to change in user id??
  const [wishlist, setWishlist] = useState([]);

  //update wishlist 
  useEffect (() => {
    if(userId) {
      const storedWishlist = localStorage.getItem(`wishListItems_${userId}`);
      // console.log(`the sored wishlisth for ${userId} is: ${storedWishlist}`);
      setWishlist( storedWishlist ? JSON.parse(storedWishlist) : []);
    }
  },[userId]);





  // effect hook to load wishlist from localstorage once userId is available
  useEffect(() => {
    // persis the wishlist the localstorage whenever it changes
    if(userId) {
      const storedWishlistnew = localStorage.getItem(`wishListItems_${userId}`);
      if(storedWishlistnew) {
        setWishlist(JSON.parse(storedWishlistnew));
      }
    }
  }, [userId]);
  
  //effect hook to persist wishlist to localstorage whenever it changes
  useEffect(() => {
    if(userId) {
      const storedWishlist = JSON.stringify(wishlist);
      // localStorage.setItem(`wishListItems_${userId}`, JSON.stringify(wishlist));
      localStorage.setItem(`wishListItems_${userId}`, JSON.stringify(wishlist));

      console.log(`items for ${userId} are: \n${JSON.parse(localStorage.getItem(`wishListItems_${userId}`)).map(item => JSON.stringify(item)).join('\n')}`)
    }

  },[wishlist, userId]);


    //handle addition of deletion in wishlist state variable
    const handleWishlist = (item) => {
      if(!userId) {
        alert("user not logged in. Please log in to manage you wishlist");
        return;
      }

      //associate the wishlist wish user
      const userWishlistkey = `wishListItems_${userId}`;

      const exists = wishlist.some((wishListItem) => wishListItem.id === item.id);
    
      if(exists) {
          setWishlist(wishlist.filter((wisthListItem) => wisthListItem.id !== item.id ));
          showNotification('Item remove from Wishlist', 'deletion');


      } else {
          setWishlist(prevWisthList => [...prevWisthList, item]);
          showNotification('Item added to Wishlist', 'success');

      }
    }    

    const deleteWishlistItem = (id) => {
      if(!userId) {
        alert('user not logged in. Please login to manage your wishlist');
      }

      const deleteUpdate = wishlist.filter((wishlistItem) => wishlistItem.id !== id);
      setWishlist(deleteUpdate);
    }

   


  return (
    <WishListContext.Provider value={{wishlist, setWishlist, handleWishlist, userId, setUserId , getUserIdFromToken, refreshUserId ,deleteWishlistItem}}>
        {children}
    </WishListContext.Provider>
  );
}

export const useWishlist = () => useContext(WishListContext);