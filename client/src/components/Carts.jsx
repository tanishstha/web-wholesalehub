import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cartContext'
import { IoCartOutline } from 'react-icons/io5';
import { MdDeleteForever } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { HiMiniMagnifyingGlassPlus } from "react-icons/hi2";
import './cart.scss';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import cart from '../assets/cart.png'

const Carts = () => {

    const navigate = useNavigate();

    const goBack = () =>  {
        navigate(-1);
    }

    const { cartItems, removeItemFromCart, totalPrice, updateItemQuantity } = useCart();


    const [carthasItem, setCartHasItem] = useState(() => {
        if(cartItems.length > 0) {
            return true;
        } else {
            return false;
        }
    })

    useEffect(() => {
        if(cartItems.length > 0) {
            setCartHasItem(true);
        } else {
            setCartHasItem(false)
        }
    }, cartItems);


    console.log("items in the cart: "+ JSON.stringify(cartItems, null, 2));
    const handleRemoveItem = (itemId) => {
        console.log('received id is: ' + itemId);
        removeItemFromCart(itemId);
    }

    // add quantity by 1
    const addItems = (id) => {
        console.log("received id is: " + id);
        const item = cartItems.find((item) => item.color._id === id) ;
        console.log("the item matches is: " + JSON.stringify(item));
        const newQuantity = item.Quantity + 1;
        console.log("the new quantity is: " + newQuantity) ;
        updateItemQuantity(id, newQuantity);
    }


    const reduceItem = (id) => {
        const item = cartItems.find((item) => item.color._id === id) ;
        const newQuantity = item.Quantity - 1;
        updateItemQuantity(id, newQuantity)
    }

    return (
        <>
            <div className='products__wrapper w-70 section__padding'>
                <div className="spacer"></div>

                {carthasItem ? 

                <>
                <h1>Shopping Cart</h1>

                <div className="cart__table">
                    <table>
                        <thead>
                            <tr className='table__header'>
                                <th></th>
                                <th>Product</th>
                                <th>unit price</th>
                                <th>quantity</th>
                                <th>sub total</th>
                                <th>remove</th>
                            </tr>
                        </thead>

                        <tbody>
                        {cartItems.map((item, index) => {
                            return (
                                <tr key={index} className='table__elements'>
                                    <td className='image__row'>
                                        {item.color.link ? (
                                            <img src={item.color.link} alt="image needed"/>) : <span>No image </span>
                                        }
                                    </td>
                                    <td className='item__details'>
                                        <div> <Link to={`/product/${item.id}`}> {item.title}</Link></div>  
                                        <div className='box__color'>
                                        <div>
                                            color:
                                            </div>
                                            <span style={{background: item.color.color, border: '1px solid white'}}> </span> 
                                        </div> 
                                    </td>
                                    <td>{item.price}</td>
                                    <td>
                                        <button className='adder' onClick={() => addItems(item.color._id)}>+</button> 
                                        {item.Quantity} 
                                        <button className='reducer' onClick={() => reduceItem(item.color._id)}>-</button> 
                                    </td>
                                    <td>{item.Quantity * item.price}</td>
                                    <td className="delete">
                                        <button onClick={() => handleRemoveItem(item.color._id)}>
                                            <MdDeleteForever size={25}/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

                <div className='cart__total'>
                    <h3>Cart Totals</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>
                                {totalPrice}
                                </td>
                            </tr>
                            <tr>
                                <td>total</td>
                                <td>{totalPrice}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="back__button">
                    <button onClick={goBack} className='btn__main'>Go Back</button>
                    <Link to='/checkout'>
                        <button  className='btn__main' >proceed to checkout</button>
                    </Link>
                </div>
                </> : 

                <div className="cartMessage__empty">
                    <h2>"The Cart seems to be empty"</h2>
                    <div className="overlay__cart">
                        <img className='image__class' src={cart} alt="image of empty cart" />
                    </div>

                    <Link to='..' className='btn__main__anch '>
                        <button className='btn__main'>start shopping</button>
                    </Link>
                </div>
                }

                



            </div> 


          
        </>
    )
}

export default Carts