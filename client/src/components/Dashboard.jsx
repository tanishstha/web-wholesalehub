import React, { useEffect, useInsertionEffect, useState } from 'react'
import { useWishlist } from '../context/WishListContext';
import './dashboard.scss';
import LayoutCart from './LayoutCart';
import { useCart } from '../context/cartContext';
import { FaCircleCheck } from "react-icons/fa6";
import { useAuth } from '../context/AuthContext';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid';
import { useNotification } from '../context/NotificationContext';
import { useViewTransitionState } from 'react-router-dom';
import { SiEsotericsoftware } from 'react-icons/si';
import { FaRegHeart } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const {isAuthenticated, logout} = useAuth();
  const {wishlist, setWishlist, userId, deleteWishlistItem} = useWishlist();
  const {addItemToCart} = useCart();
  const {showNotification} = useNotification();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();
  // console.log('form value: ', isFormVisible);

  //collect vbalue from local storage for receiving shipped information for history
  const [orderHistory, setOrderHistory] = useState(() => {
    const orderHistoryLL = JSON.parse(localStorage.getItem(`orderDetails_${userId}`));
    return orderHistoryLL ? orderHistoryLL : [];
  });

  useEffect(() => {
    setOrderHistory(JSON.parse(localStorage.getItem(`orderDetails_${userId}`)));
  },[userId]);

  console.log('received ordr history', orderHistory);

  //set a address card as active for shipping
  const [getAddress, setGetAddress] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  const [activeTab, setActiveTab] = useState(0);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone_number: Yup.string().required('Phone number is required'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('Region is required'),
    country: Yup.string().required('Country is required'),
  });
  
  // get address the user have already added in the dashboard

  const fetchAddresses = () => {
    const storedAddress = JSON.parse(localStorage.getItem(`shipping_${userId}`)) || [];
    setGetAddress(storedAddress);
    console.log("stored address " ,storedAddress);
  }

  // initialize address on first render
  useEffect(() => {
    fetchAddresses();
  },[userId])

    
  //   //reassign getAddress as array;
  //   if(!Array.isArray(storedAddress)) {
  //     storedAddress = [];
  //     setGetAddress(storedAddress);
  //   } else {
  //     setGetAddress([])
  //   }
    
  // },[userId]);

  const handleCardClick = (id) => {
    // localStorage.removeItem(`shipping_${userId}`);
    const updatedAddress = [...getAddress];
    //if clicked card is already active do nothing
    // if(updatedAddress[id].default) return;
    
    //reset other addresses to non-defualt and set the clicked address as default
    updatedAddress.forEach((address) => {
      address.default = false;
    });
    
    const clickedAddress = updatedAddress.find(address => address.id === id);

    if(clickedAddress) {
      clickedAddress.default = true;
      console.log(updatedAddress);
    }
    // updatedAddress[id].default = true; //mark clicked address as default

    // save updated addresses to localstorage
    localStorage.setItem(`shipping_${userId}`, JSON.stringify(updatedAddress));

    ///show notificaiton
    showNotification('shipping address changes successfully' , 'success');

    //update the state and set the clicked card as active
    setGetAddress(updatedAddress);

    setActiveCard(id);
  }

  const handleLogout = () => {
    logout();
    navigate('..');
  }

  

  // console.log("received address ", getAddress);


  return (
    <>
        <div className='dashboard'>
            <div className='spacer'></div>
            <div className='section__padding w-80'>

              <h3>Welcome <em>"{userId}"</em></h3>


              <div className='tab__parent'>
                <div className='tabs'>
                  <button onClick={() => setActiveTab(0)}>Wishlist <FaRegHeart /></button>
                  <button onClick={() => setActiveTab(1)}>Address <FaRegAddressBook/></button>
                  <button onClick={() => setActiveTab(2)}>History <FaHistory/></button>
                  
                  <button onClick={handleLogout}>Logout <HiLogout /></button>
                </div>

                <div className='tab-content'>
                  {/* <div className='hr_line'></div> */}
                  {activeTab === 0 && 
                  <>
                      {/* <h1>Wishlist Items: </h1> */}

                      <div className="cart__table">
                        <table>
                            <thead>
                                <tr className='table__header'>
                                    <th></th>
                                    <th>Product</th>
                                    <th>unit price</th>
                                    <th>remove</th>
                                    <th>Add to cart</th>
                                </tr>
                            </thead>

                            <tbody>
                              {wishlist.map((item) => (
                                  <LayoutCart key={item.id} productName={item.title} imageLink={item.color.link} id={item.id} price={item.price} color={item.color.color} onDelete={() => deleteWishlistItem(item.id)} onAddtoCart={() => addItemToCart(item)} item={item}/>
                              ))}
                            </tbody>
                        </table>
                      </div>
                  </>
                  }
                  
                  {activeTab === 1 && 
                    <> 
                      <div className='addShipingAddress'>
                      <Formik initialValues={{
                        name: '',
                        email: '',
                        phone_number: '',
                        city: '',
                        region: '',
                        country: '',
                        default: false,
                      }}

                      validationSchema={validationSchema}
                      onSubmit={(values) => {
                          //generate unique id with uuid
                          const uniqueId = uuidv4();

                          const entryWithId = {...values, id: uniqueId};

                          let  existingEntries = JSON.parse(localStorage.getItem(`shipping_${userId}`)) || [];

                          if(!Array.isArray(existingEntries)) {
                            existingEntries = [];
                          }
                          //add new entry 
                          existingEntries.push(entryWithId);

                          localStorage.setItem(`shipping_${userId}`, JSON.stringify(existingEntries));

                          console.log(existingEntries);
                          setIsFormVisible(false);
                          fetchAddresses();
                          // localStorage.removeItem(`shipping_${userId}`);

                      }}


                      >
                        {({values}) => ( 
                          <>

                            <div className='shipping__cards'>
                              <div className='shipping__info'>
                                {getAddress.map((user, index) => (
                                  <div className={`card__single__shipping__address ${user.default ? 'active' : ''}`} key={user.id} onClick={() => handleCardClick(user.id)}>
                                    <p className='userName'>{user.name}</p>
                                    <p>{user.email}</p>
                                    <p>{user.phone_number}</p>
                                    <p className=''><div> Shipping address:</div> <div>{user.city}, {user.region}, {user.country}</div></p>
                                    <div className='checkmark'>
                                      <FaCircleCheck size={20}/>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>


                            {getAddress.length > 0 ? <button className="btn__main btn__add__address" onClick={() => setIsFormVisible(true)}>Add another Shipping Address</button> : 
                            (
                              <>
                                <button className='btn__main' onClick={() => setIsFormVisible(true)}>Add a Shipping Address</button>
                              </>
                            )}
                              
                              {isFormVisible && (

                                <>
                                <h3 className='add_address_form'>Add a Shipping Address</h3>

                                <Form className='add__address__form'>
                                  <div className='form__grp'>
                                    <label htmlFor="name">Full Name</label>
                                    <Field type='text' id="name" name="name" />
                                    <ErrorMessage name="name" component="div" className='error' />
                                  </div>
    
                                  <div className='form__grp'>
                                    <label htmlFor="email">Email Address</label>
                                    <Field type='text' id="email" name="email" />
                                    <ErrorMessage name="email" component="div" className='error' />
                                  </div>
    
                                  <div className='form__grp'>
                                    <label htmlFor="phone_number">Phone Number</label>
                                    <Field type='text' id="phone_number" name="phone_number" />
                                    <ErrorMessage name="phone_number" component="div" className='error' />
                                  </div>
                                  
                                  <div className='form__grp'>
                                        <label htmlFor="city">City</label>
                                        <Field type="text" id="city"  name="city"/>
                                      <ErrorMessage name='city' component="div" className='error'/>
                                  </div>
    
                                  <div className='form__grp'>
                                      <label htmlFor="region">Region/state</label>
                                      <Field type="text" id="region"  name="region"  />
                                      <ErrorMessage name='region' component="div" className='error'/>
                                  </div>
    
                                  <div className='form__grp'>
                                      <label htmlFor="country">Country</label>
                                      <Field type="text" id="country"  name="country" />
                                      <ErrorMessage name='country' component="div" className='error'/>
                                  </div>
    
                                  <div className='submit__button'>
                                    <button type='submit' className='btn__main'>submit</button>
                                  </div>
                                </Form>
                                </>
                            
                              )}
                           
                          </>
                        )}
                      </Formik>
                      </div>
                      
                     
                    </>
                  }

                  {activeTab === 2 && 
                    <>
                    {orderHistory ?
                      <>
                    <div className='history__card__header'>
                      <p>Order Image</p>
                      <p>Item Title</p>
                      <p>Quantity</p>
                      <p>Status</p>
                      <p>Order Date</p>
                    </div>
                  {  orderHistory.map((order) => {
                    return (
                        order.cartItems.map((singleItem) => {
                          return (
                          
                          <div className="history__card__single">
                            <div className='img__holder'>
                              <img src={singleItem.color.link} alt="" />
                            </div>

                            <p className='history__card__name'>{singleItem.title}</p>
                            <div className='quantity__ordered'>Qty: {singleItem.Quantity}</div>
                            <div className='status'><p>Completed <FaRegCheckCircle/></p> </div>
                            <div className='order_date'>01/22/2024</div>
                          </div>)
                        }))
                      })}
                    </>

                    : <div className=''>No History to Display</div>
                    }
                    </>
                  }
                </div>
              </div>
            </div>
        </div>
    </>
  )
}

export default Dashboard