import React, {createContext, useContext, useEffect, useState} from 'react'
import { useWishlist } from './WishListContext';

const OrderContext = createContext();

export const OrderContextProvider = ({children}) => {
    const {userId} = useWishlist();

    const[orderDataList, setOrderDataList] = useState(() => {
        const savedOrderData = localStorage.getItem(`orderDetails_${userId}`);
        return savedOrderData ? JSON.parse(savedOrderData) : [] ;
    })

    const addToOrderList = (item) => {
        //add items on top of previous orderDatalist items
        setOrderDataList((previtem) => [...previtem, item]);
    }

    // const deleteOrderList = (item) => {
    //     // setOrderDataList(prevItem => )
    // }

    useEffect(() => {
        localStorage.setItem(`orderDetails_${userId}`, JSON.stringify(orderDataList));
        // localStorage.removeItem(`orderDetails_${userId}`);

        
    },[orderDataList])

    return (
        <OrderContext.Provider value={{orderDataList, setOrderDataList, addToOrderList}}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrderData = () => useContext(OrderContext);


