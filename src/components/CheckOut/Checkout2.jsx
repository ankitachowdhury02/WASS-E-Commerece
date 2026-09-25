import React from "react";
import "./Checkout2.css";

const Checkout2 = () => {
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

        <div className="product-row">
          <p>Syltherine Sheesham Chair&nbsp;&nbsp; × 1</p>
          <p>₹ 2,499.00</p>
        </div>

        <div className="subtotal-row">
          <p>Subtotal</p>
          <p>₹ 2,499.00</p>
        </div>

        <div className="total-row">
          <p>Total</p>
          <strong>₹ 2,499.00</strong>
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

        <button className="place-order">
          Place order
        </button>

      </div>

    </section>
  );
};

export default Checkout2;