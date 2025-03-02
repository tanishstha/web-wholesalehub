import { ConfigContext } from 'antd/es/config-provider';
import React, {createContext, useContext, useState, useEffect} from 'react';
import { MdLocalGasStation } from 'react-icons/md';

//create the context
//this allows us to pass cart data down the componenet tree without manually passing props
const cartContext = createContext();

//create the provider component

//the cartProvider component will wrap the parts of the app where the cart context is needed
export const CartProvider = ({children}) => {
    //setup cartitems sstate
    //initialize cart state with data from localstorage, or empty array if no data is found

    const [cartItems, setCartItems] = useState(() => {
        //check if there is saved cart data in localstorage
        const savedCart = sessionStorage.getItem('card');

        //if cart data exists, parse and use it, othersier use an emply array
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    // useEffect(() => {
    //     console.log('change in cart items detected: ' + cartItems);
    // }, [cartItems]);

    //sync cart items with localstorage
    //whenever the cartitsm state changes, save the updated state to localstorage

    useEffect(() => {
        sessionStorage.setItem('card', JSON.stringify(cartItems));
    },[cartItems]); //effect runs whenever cartitems changes

    //function to add an item to the cart
    const addItemToCart = (item) => {
        setCartItems(prevItems => [...prevItems, item]); //adds items to the previous cart items
    }


    //functio to add an item to the cart and also merger previous items
    // const addItemToCart = (newitem) => {
    //     setCartItems((prevItems) => {
    //         const existingItemIndex = prevItems.findIndex();
    //     }); //adds items to the previous cart items
    // }

    //function to remove an item from the card using its id
    const removeItemFromCart = (id) => {
        setCartItems(prevItems=> prevItems.filter(item => item.color._id !== id));
        // removed item matching the id
    }

    const emptyCart =() => {
        setCartItems([]);
    }

    //function to update the quantity of an item in the cart
    const updateItemQuantity = (id, Quantity) => {
        setCartItems(prevItems => prevItems.map(item => item.color._id === id ? {...item, Quantity} : item))
        //update the quantity of the matching item
    }

    //calculate total numbe of items in the cart
    const cartItemCount = cartItems.length;

    //calculate the total price of all the items in the cart 
    const totalPrice = cartItems.reduce((total, item) => {
        return total + parseFloat(item.price * item.Quantity);
    },0);

    // provide the context value
    return (
        <cartContext.Provider value = {{cartItems, addItemToCart, removeItemFromCart, updateItemQuantity, cartItemCount, totalPrice , emptyCart }}>
            {children}
        </cartContext.Provider>
    )


 }

// creating custom hook for easier access to the cart ConfigContext
// the usecart hook allows any component to easilty access the context value
export const useCart = () => useContext(cartContext);
//this will return the cotext value from cartContext