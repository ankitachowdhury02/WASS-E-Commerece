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
          <select>
            <option>Sri Lanka</option>
            <option>India</option>
            <option>Bangladesh</option>
          </select>
        </div>

        <div className="field">
          <label>Street address</label>
          <input type="text" />
        </div>

        <div className="field">
          <label>Town / City</label>
          <input type="text" />
        </div>

        <div className="field">
          <label>Province</label>
          <select>
            <option>Western Province</option>
            <option>Eastern Province</option>
            <option>Northern Province</option>
          </select>
        </div>

        <div className="field">
          <label>ZIP code</label>
          <input type="text" />
        </div>

        <div className="field">
          <label>Phone</label>
          <input type="text" />
        </div>

        <div className="field">
          <label>Email address</label>
          <input type="email" />
        </div>

        <div className="field">
          <input
            type="text"
            placeholder="Additional information"
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
          <p>Asgaard sofa&nbsp;&nbsp; × 1</p>
          <p>Rs. 250,000.00</p>
        </div>

        <div className="subtotal-row">
          <p>Subtotal</p>
          <p>Rs. 250,000.00</p>
        </div>

        <div className="total-row">
          <p>Total</p>
          <strong>Rs. 250,000.00</strong>
        </div>

        <hr />

        <div className="payment">
          <p className="active-payment">
            ● &nbsp; Direct Bank Transfer
          </p>

          <p className="payment-text">
            Make your payment directly into our bank account.
            Please use your Order ID as the payment reference.
            Your order will not be shipped until the funds have
            cleared in our account.
          </p>

          <label>
            <input type="radio" name="payment" />
            Direct Bank Transfer
          </label>

          <label>
            <input type="radio" name="payment" />
            Cash On Delivery
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