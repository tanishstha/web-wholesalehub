import React, { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import { IoCartOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniMagnifyingGlassPlus } from "react-icons/hi2";
import "./cart.scss";
import "./checkout.scss";
import { useWishlist } from "../context/WishListContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaShield } from "react-icons/fa6";
import { useOrderData } from "../context/OrderContext";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { TiTick } from "react-icons/ti";

const Checkout = () => {
  //mero-- Santosh

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();

  const [isSameAddress, setIsSameAddress] = useState(false);
  //Sammma
  //cart
  const { userId } = useWishlist();
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const { addToOrderList, orderDataList, setOrderDataList } = useOrderData();

  const goBack = () => {
    navigate(-1);
  };

  const { cartItems, removeItemFromCart, totalPrice, updateItemQuantity } =
    useCart();

  //create copy of cart items context variable

  // console.log("items in the cart: "+ JSON.stringify(cartItems, null, 2));

  const [cartitemLocal, setCartItemLocal] = useState(cartItems);
  // console.log("caritem local with copy ============" , cartitemLocal);

  // add quantity by 1
  const addItems = (id) => {
    // console.log("received id is: " + id);
    const item = cartItems.find((item) => item.color._id === id);
    // console.log("the item matches is: " + JSON.stringify(item));
    const newQuantity = item.Quantity + 1;
    // console.log("the new quantity is: " + newQuantity) ;
    updateItemQuantity(id, newQuantity);
  };

  const reduceItem = (id) => {
    const item = cartItems.find((item) => item.color._id === id);
    const newQuantity = item.Quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  useEffect(() => {
    // Load default billing address from localStorage
    const addresses =
      JSON.parse(localStorage.getItem(`shipping_${userId}`)) || [];
    const defaultAddress = addresses.find(
      (address) => address.default === true
    );

    if (defaultAddress) {
      // Populate billing fields
      setValue("fullName", defaultAddress.name || "");
      setValue("email", defaultAddress.email || "");
      setValue("phone", defaultAddress.phone_number || "");
      setValue("address", defaultAddress.address || "");
      setValue("city", defaultAddress.city || "");
      setValue("region", defaultAddress.region || "");
      setValue("country", defaultAddress.country || "");
    } else {
      console.error("No default billing address found in localStorage.");
    }
  }, [userId, setValue]);

  const [intialFormValues, setInitialFormValues] = useState({
    name: "",
    email: "",
    phone_number: "",
    city: "",
    region: "",
    country: "",
    card: "",
  });

  const handleSameAddressChange = (event) => {
    const checked = event.target.checked;
    setIsSameAddress(checked);

    if (checked) {
      // Populate shipping fields with billing values
      setValue("shippingFullName", getValues("fullName"));
      setValue("shippingEmail", getValues("email"));
      setValue("shippingPhone", getValues("phone"));
      setValue("shippingAddress", getValues("address"));
      setValue("shippingCity", getValues("city"));
      setValue("shippingRegion", getValues("region"));
      setValue("shippingCountry", getValues("country"));
    } else {
      // Clear shipping fields
      setValue("shippingFullName", "");
      setValue("shippingEmail", "");
      setValue("shippingPhone", "");
      setValue("shippingAddress", "");
      setValue("shippingCity", "");
      setValue("shippingRegion", "");
      setValue("shippingCountry", "");
    }
  };

  const onSubmit = (formData) => {
    const orderData = {
      formData,
      cartData: cartItems,
      totalPrice,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = [...existingOrders, orderData];

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setOrderPlaced(true);
    // reset();
  };

  return (
    <>
      <div className="spacer"></div>
      {/* <div className="spacer"></div> */}
      {/* Santosh   */}
      <div className="checkout-wrapper w-70">
        <h1>Checkout</h1>
        <p style={{ color: "black" }}>
          <TiTick /> &nbsp; No Returns.
        </p>
        <p style={{ color: "black" }}>
          <TiTick /> &nbsp; Exchange for manufacturing defect products only.
        </p>
        <form className="checkout-form ">
          <div className="form-sections">
            {/* Billing Details */}
            <div className="form-section">
              <h2>Billing Details</h2>

              <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  {...register("fullName", {
                    required: "Full Name is required",
                  })}
                />
                {errors.fullName && <p>{errors.fullName.message}</p>}
              </div>

              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Phone number should contain only numbers",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be at least 10 digits",
                    },
                    maxLength: {
                      value: 15,
                      message: "Phone number cannot exceed 15 digits",
                    },
                  })}
                />
                {errors.phone && <p>{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  {...register("address", {
                    required: "Address is required",
                  })}
                />
                {errors.address && <p>{errors.address.message}</p>}
              </div>

              <div>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  {...register("city", { required: "City is required" })}
                />
                {errors.city && <p>{errors.city.message}</p>}
              </div>

              <div>
                <label htmlFor="region">Region/State</label>
                <input
                  id="region"
                  type="tel"
                  {...register("region", {
                    required: "Region/State is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Region should contain only numbers",
                    },
                  })}
                />
                {errors.region && <p>{errors.region.message}</p>}
              </div>

              <div>
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  {...register("country", { required: "Country is required" })}
                >
                  <option value="">Select a country</option>
                  <option value="Nepal">Nepal</option>
                </select>
                {errors.country && <p>{errors.country.message}</p>}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="form-section">
              <h2>Shipping Details</h2>

              <div className="checkbox">
                <label htmlFor="sameAddress">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    checked={isSameAddress}
                    onChange={handleSameAddressChange}
                  />
                  <span>Ship to same address</span>
                </label>
              </div>

              <div>
                <label htmlFor="shippingFullName">Full Name</label>
                <input
                  id="shippingFullName"
                  {...register("shippingFullName", {
                    required: "Full Name is required",
                  })}
                  disabled={isSameAddress}
                />
                {errors.shippingFullName && (
                  <p>{errors.shippingFullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="shippingEmail">Email Address</label>
                <input
                  id="shippingEmail"
                  type="email"
                  {...register("shippingEmail", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  disabled={isSameAddress}
                />
                {errors.shippingEmail && <p>{errors.shippingEmail.message}</p>}
              </div>

              <div>
                <label htmlFor="shippingPhone">Phone</label>
                <input
                  id="shippingPhone"
                  type="tel"
                  {...register("shippingPhone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Phone number should contain only numbers",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be at least 10 digits",
                    },
                    maxLength: {
                      value: 15,
                      message: "Phone number cannot exceed 15 digits",
                    },
                  })}
                  disabled={isSameAddress}
                />
                {errors.shippingPhone && <p>{errors.shippingPhone.message}</p>}
              </div>

              <div>
                <label htmlFor="shippingAddress">Address</label>
                <textarea
                  id="shippingAddress"
                  {...register("shippingAddress", {
                    required: "Address is required",
                  })}
                  disabled={isSameAddress}
                />
                {errors.shippingAddress && (
                  <p>{errors.shippingAddress.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="shippingCity">City</label>
                <input
                  id="shippingCity"
                  {...register("shippingCity", {
                    required: "City is required",
                  })}
                  disabled={isSameAddress}
                />
                {errors.shippingCity && <p>{errors.shippingCity.message}</p>}
              </div>

              <div>
                <label htmlFor="shippingRegion">Region/State</label>
                <input
                  id="shippingRegion"
                  {...register("shippingRegion", {
                    required: "Region/State is required",
                  })}
                  disabled={isSameAddress}
                />
                {errors.shippingRegion && (
                  <p>{errors.shippingRegion.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="shippingCountry">Country</label>
                <select
                  id="shippingCountry"
                  {...register("shippingCountry", {
                    required: "Country is required",
                  })}
                  disabled={isSameAddress}
                >
                  <option value="">Select a country</option>
                  <option value="Nepal">Nepal</option>
                </select>
                {errors.shippingCountry && (
                  <p>{errors.shippingCountry.message}</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* Ya samma */}
      <div className="w-70 section__padding section__checkout">
        {orderPlaced ? (
          <>
            <div className="order__placed__message">
              <h4>Order successfuly placed</h4>
            </div>
          </>
        ) : (
          <>
            <div className="cart__item__details items__right">
              <h3>Shopping Cart</h3>

              <div className="cart__table">
                <table>
                  <thead>
                    <tr className="table__header">
                      <th></th>
                      <th>Product</th>
                      <th>quantity</th>
                      <th>sub total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item, index) => {
                      return (
                        <tr key={index} className="table__elements">
                          <td className="image__row">
                            {item.color.link ? (
                              <img src={item.color.link} alt="image needed" />
                            ) : (
                              <span>No image </span>
                            )}
                          </td>
                          <td className="item__details">
                            <div>
                              {" "}
                              <Link to={`/product/${item.id}`}>
                                {" "}
                                {item.title}
                              </Link>
                            </div>
                            <div className="box__color">
                              <div>color:</div>
                              <span
                                style={{
                                  background: item.color.color,
                                  border: "1px solid white",
                                }}
                              >
                                {" "}
                              </span>
                            </div>
                          </td>
                          {/* <td>{item.price}</td> */}
                          <td>
                            <button
                              className="adder"
                              onClick={() => addItems(item.color._id)}
                            >
                              +
                            </button>
                            {item.Quantity}
                            <button
                              className="reducer"
                              onClick={() => reduceItem(item.color._id)}
                            >
                              -
                            </button>
                          </td>
                          <td>{item.Quantity * item.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="cart__total">
                <h3>Cart Totals</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>Subtotal</td>
                      <td>{totalPrice}</td>
                    </tr>
                    <tr>
                      <td>total</td>
                      <td>{totalPrice}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <div className="submit">
                <button
                  type="submit"
                  className="btn__main"
                  onClick={handleSubmit(onSubmit)}
                >
                  Place Order
                </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Checkout;
