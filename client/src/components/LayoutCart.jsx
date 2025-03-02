//IMPORTANT: LAYOUT CART IS ONLY RECEIVING PROPS FROM DASHBOARD NOT FROM CARTS
//RESUABLE COMPONENET TO SHOW LIST OF ITEMS IN CART OR WISHLIST

import React from 'react'
import './cart.scss';
import { MdDeleteForever } from 'react-icons/md';
import { LuShoppingCart } from "react-icons/lu";
import { useParams, useOutletContext, Link } from 'react-router-dom';

const LayoutCart = ({productName, imageLink, id, price, color, onDelete,onAddtoCart }) => {
    const {productId} = useParams();
    
    // console.log('receiverd proudcust id in layouts of cart page :::::::>>>>>>>>>>' , {id});

  return (
    <>
        <tr key={id} className='table__elements'>
            <td className='image__row'>
                {imageLink ? (
                    <img src={imageLink} alt="image needed"/>) : <span>No image </span>
                }
            </td>
            <td className='item__details'>
                <div>
                    
                        <Link to={`/product/${id}`}>  {productName}</Link>
                    
                </div>  
                <div className='box__color'>
                    <div>
                    color:
                    </div>
                    <span style={{background: color, border: '1px solid white'}}> </span> 
                </div> 
            </td>
            <td>{price}</td>
         
            <td className="delete">
                <button onClick={onDelete}>
                    <MdDeleteForever size={25}/>
                </button>
            </td>

            <td className='addtoCart'>
                <button onClick={onAddtoCart}>
                    <LuShoppingCart size={25}/>
                </button>
            </td>
        </tr>
    </>
  )
}

export default LayoutCart