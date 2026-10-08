import React from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import "./Checkout2.css";

const Checkout2 = () => {
  const location = useLocation();
  const { cartItems } = useCart();

  // Helper to convert price to number
  const getPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return 0;
    }
    return Number(String(price).replace(/[^0-9.-]/g, "")) || 0;
  };

  // Helper to format price
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // Check if a single product was sent from "Buy Now" button
  const buyNowProduct = location.state?.product;

  // If "Buy Now" product exists, bill ONLY this product!
  // Otherwise, fallback to cart items or sample product
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
    billingItems = [
      {
        name: "Syltherine Sheesham Chair",
        quantity: 1,
        price: 2499,
      },
    ];
  }

  // Calculate total billing amount
  const subtotal = billingItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully!");
  };

  return (
    <section className="checkout">

      {/* LEFT SIDE */}
      <div className="billing">
        <h1>Billing details</h1>

        <div className="name-row">                          
          <div className="field">
            <label>First Name</label>
            <input type="text" />
          </div>

          <div className="field">
            <label>Last Name</label>
            <input type="text" />
          </div>
        </div>

        <div className="field">
          <label>Company Name (Optional)</label>
          <input type="text" />
        </div>

        <div className="field">
          <label>Country / Region</label>
          <select defaultValue="India">
            <option>India</option>
            <option>Sri Lanka</option>
            <option>Bangladesh</option>
          </select>
        </div>

        <div className="field">
          <label>Street address</label>
          <input type="text" placeholder="House number and street name" />
        </div>

        <div className="field">
          <label>Town / City</label>
          <input type="text" placeholder="City / District" />
        </div>

        <div className="field">
          <label>State</label>
          <select defaultValue="West Bengal">
            <option>West Bengal</option>
            <option>Maharashtra</option>
            <option>Delhi NCR</option>
            <option>Karnataka</option>
            <option>Tamil Nadu</option>
            <option>Gujarat</option>
            <option>Uttar Pradesh</option>
            <option>Rajasthan</option>
            <option>Telangana</option>
            <option>Kerala</option>
          </select>
        </div>

        <div className="field">
          <label>PIN Code</label>
          <input type="text" placeholder="6-digit PIN Code" />
        </div>

        <div className="field">
          <label>Phone</label>
          <input type="text" placeholder="+91 98765 43210" />
        </div>

        <div className="field">
          <label>Email address</label>
          <input type="email" placeholder="email@example.com" />
        </div>

        <div className="field">
          <input
            type="text"
            placeholder="Additional information (e.g. landmark, delivery instructions)"
          />
        </div>
      </div>


      {/* RIGHT SIDE */}
      <div className="order">

        <div className="order-heading">
          <h2>Product</h2>
          <h2>Subtotal</h2>
        </div>

        {billingItems.map((item, index) => (
          <div className="product-row" key={index}>
            <p>
              {item.name}&nbsp;&nbsp; × {item.quantity}
            </p>
            <p>₹ {formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}

        <div className="subtotal-row">
          <p>Subtotal</p>
          <p>₹ {formatPrice(subtotal)}</p>
        </div>

        <div className="total-row">
          <p>Total</p>
          <strong>₹ {formatPrice(subtotal)}</strong>
        </div>

        <hr />

        <div className="payment">
          <p className="active-payment">
            ● &nbsp; UPI / Online Payment
          </p>

          <p className="payment-text">
            Pay instantly and securely using Google Pay, PhonePe, Paytm,
            BHIM UPI, Credit/Debit Card, or Net Banking.
          </p>

          <label>
            <input type="radio" name="payment" defaultChecked />
            UPI / Net Banking / Cards
          </label>

          <label>
            <input type="radio" name="payment" />
            Cash On Delivery (COD)
          </label>
        </div>

        <p className="privacy">
          Your personal data will be used to support your experience
          throughout this website, to manage access to your account,
          and for other purposes described in our <b>privacy policy.</b>
        </p>

        <button className="place-order" onClick={handlePlaceOrder}>
          Place order
        </button>

      </div>

    </section>
  );
};

export default Checkout2;