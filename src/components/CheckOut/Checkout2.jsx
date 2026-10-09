import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import "./Checkout2.css";

const API_URL = "https://ecomm-qy13.onrender.com";

const Checkout2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, clearCart } = useCart();

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "India",
    streetAddress: "",
    city: "",
    state: "West Bengal",
    pinCode: "",
    phone: "",
    email: "",
    additionalInformation: "",
  });

  // =========================================================
  // PAYMENT METHOD
  // =========================================================

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // =========================================================
  // ORDER LOADING
  // =========================================================

  const [orderLoading, setOrderLoading] = useState(false);

  // =========================================================
  // HELPER - CONVERT PRICE TO NUMBER
  // =========================================================

  const getPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return 0;
    }

    return Number(String(price).replace(/[^0-9.-]/g, "")) || 0;
  };

  // =========================================================
  // HELPER - FORMAT PRICE
  // =========================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // =========================================================
  // BUY NOW PRODUCT
  // =========================================================

  const buyNowProduct = location.state?.product;

  // =========================================================
  // BILLING ITEMS
  // =========================================================

  let billingItems = [];

  if (buyNowProduct) {
    billingItems = [
      {
        name: buyNowProduct.name || "Product",
        quantity: buyNowProduct.quantity || 1,
        price: getPrice(buyNowProduct.price),
      },
    ];
  } else if (cartItems && cartItems.length > 0) {
    billingItems = cartItems.map((item) => ({
      name: item.name || item.title || "Product",
      quantity: item.quantity || 1,
      price: getPrice(item.price),
    }));
  } else {
    billingItems = [];
  }

  // =========================================================
  // CALCULATE SUBTOTAL
  // =========================================================

  const subtotal = billingItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE PAYMENT CHANGE
  // =========================================================

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("Please enter your first name.");
      return false;
    }

    if (!formData.lastName.trim()) {
      toast.error("Please enter your last name.");
      return false;
    }

    if (!formData.streetAddress.trim()) {
      toast.error("Please enter your street address.");
      return false;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }

    if (!formData.state.trim()) {
      toast.error("Please select your state.");
      return false;
    }

    if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      toast.error("Please enter a valid 6-digit PIN code.");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (billingItems.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }

    return true;
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = async () => {
    // Prevent multiple clicks
    if (orderLoading) {
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Get login token
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login before placing your order.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    try {
      setOrderLoading(true);

      // =====================================================
      // ORDER PAYLOAD
      // =====================================================

      const orderData = {
        firstName: formData.firstName.trim(),

        lastName: formData.lastName.trim(),

        companyName: formData.companyName.trim(),

        country: formData.country,

        streetAddress: formData.streetAddress.trim(),

        city: formData.city.trim(),

        state: formData.state,

        pinCode: formData.pinCode.trim(),

        phone: formData.phone.trim(),

        email: formData.email.trim(),

        additionalInformation:
          formData.additionalInformation.trim(),

        paymentMethod: paymentMethod === "COD" ? "COD" : "UPI",
      };

      console.log("ORDER PAYLOAD:", orderData);

      // =====================================================
      // API CALL
      // =====================================================

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(orderData),
      });

      // =====================================================
      // RESPONSE
      // =====================================================

      const data = await response.json();

      console.log("ORDER API RESPONSE:", data);

      // =====================================================
      // ERROR
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to place order."
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      toast.success(
        data?.message || "Order placed successfully!"
      );

      // Clear cart only when normal cart checkout
      // Buy Now product may not belong to cart
      if (!buyNowProduct && clearCart) {
        clearCart();
      }

      // =====================================================
      // OPTIONAL RESET
      // =====================================================

      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        country: "India",
        streetAddress: "",
        city: "",
        state: "West Bengal",
        pinCode: "",
        phone: "",
        email: "",
        additionalInformation: "",
      });

      // =====================================================
      // REDIRECT TO ORDERS PAGE
      // =====================================================

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error);

      toast.error(
        error.message || "Something went wrong while placing the order."
      );
    } finally {
      setOrderLoading(false);
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <section className="checkout">

      {/* =====================================================
          LEFT SIDE - BILLING
      ====================================================== */}

      <div className="billing">

        <h1>Billing details</h1>

        {/* FIRST + LAST NAME */}

        <div className="name-row">

          <div className="field">
            <label>First Name</label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
            />
          </div>

          <div className="field">
            <label>Last Name</label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
            />
          </div>

        </div>

        {/* COMPANY */}

        <div className="field">

          <label>
            Company Name (Optional)
          </label>

          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />

        </div>

        {/* COUNTRY */}

        <div className="field">

          <label>Country / Region</label>

          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="India">India</option>
            <option value="Sri Lanka">
              Sri Lanka
            </option>
            <option value="Bangladesh">
              Bangladesh
            </option>
          </select>

        </div>

        {/* STREET */}

        <div className="field">

          <label>Street address</label>

          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="House number and street name"
          />

        </div>

        {/* CITY */}

        <div className="field">

          <label>Town / City</label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City / District"
          />

        </div>

        {/* STATE */}

        <div className="field">

          <label>State</label>

          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
          >

            <option value="West Bengal">
              West Bengal
            </option>

            <option value="Maharashtra">
              Maharashtra
            </option>

            <option value="Delhi NCR">
              Delhi NCR
            </option>

            <option value="Karnataka">
              Karnataka
            </option>

            <option value="Tamil Nadu">
              Tamil Nadu
            </option>

            <option value="Gujarat">
              Gujarat
            </option>

            <option value="Uttar Pradesh">
              Uttar Pradesh
            </option>

            <option value="Rajasthan">
              Rajasthan
            </option>

            <option value="Telangana">
              Telangana
            </option>

            <option value="Kerala">
              Kerala
            </option>

          </select>

        </div>

        {/* PIN */}

        <div className="field">

          <label>PIN Code</label>

          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            maxLength="6"
            placeholder="6-digit PIN Code"
          />

        </div>

        {/* PHONE */}

        <div className="field">

          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />

        </div>

        {/* EMAIL */}

        <div className="field">

          <label>Email address</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />

        </div>

        {/* ADDITIONAL INFORMATION */}

        <div className="field">

          <input
            type="text"
            name="additionalInformation"
            value={formData.additionalInformation}
            onChange={handleChange}
            placeholder="Additional information (e.g. landmark, delivery instructions)"
          />

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE - ORDER
      ====================================================== */}

      <div className="order">

        <div className="order-heading">

          <h2>Product</h2>

          <h2>Subtotal</h2>

        </div>


        {/* PRODUCT LIST */}

        {billingItems.length > 0 ? (

          billingItems.map((item, index) => (

            <div
              className="product-row"
              key={index}
            >

              <p>
                {item.name}
                &nbsp;&nbsp; × {item.quantity}
              </p>

              <p>
                ₹ {formatPrice(
                  item.price * item.quantity
                )}
              </p>

            </div>

          ))

        ) : (

          <div className="product-row">

            <p>No products</p>

            <p>₹ 0</p>

          </div>

        )}


        {/* SUBTOTAL */}

        <div className="subtotal-row">

          <p>Subtotal</p>

          <p>
            ₹ {formatPrice(subtotal)}
          </p>

        </div>


        {/* TOTAL */}

        <div className="total-row">

          <p>Total</p>

          <strong>
            ₹ {formatPrice(subtotal)}
          </strong>

        </div>


        <hr />


        {/* =================================================
            PAYMENT
        ================================================== */}

        <div className="payment">

          <p className="active-payment">
            ● &nbsp; Payment Method
          </p>

          <p className="payment-text">
            Choose your preferred payment method.
          </p>


          {/* UPI */}

          <label>

            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={handlePaymentChange}
            />

            UPI / Net Banking / Cards

          </label>


          {/* COD */}

          <label>

            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={handlePaymentChange}
            />

            Cash On Delivery (COD)

          </label>

        </div>


        {/* PRIVACY */}

        <p className="privacy">

          Your personal data will be used to support
          your experience throughout this website,
          to manage access to your account, and for
          other purposes described in our{" "}
          <b>privacy policy.</b>

        </p>


        {/* PLACE ORDER */}

        <button
          className="place-order"
          onClick={handlePlaceOrder}
          disabled={orderLoading}
        >

          {orderLoading
            ? "Placing Order..."
            : "Place order"}

        </button>

      </div>

    </section>
  );
};

export default Checkout2;