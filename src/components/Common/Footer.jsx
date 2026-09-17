import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-company">

          <h2>Furniro.</h2>

          <p>
            400 University Drive Suite 200 Coral Gables,
            <br />
            FL 33134 USA
          </p>

        </div>


      
        <div className="footer-column">

          <h3>Links</h3>

          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>

        </div>


        <div className="footer-column">

          <h3>Help</h3>

          <a href="/payment">Payment Options</a>
          <a href="/returns">Returns</a>
          <a href="/privacy">Privacy Policies</a>

        </div>
 
        <div className="footer-newsletter">

          <h3>Newsletter</h3>

          <div className="subscribe-box">

            <input
              type="email"
              placeholder="Enter Your Email Address"
            />

            <button>SUBSCRIBE</button>

          </div>

        </div>

      </div>


      <div className="footer-bottom">

        <p>2023 furniro. All rights reserved</p>

      </div>

    </footer>
  );
};

export default Footer;