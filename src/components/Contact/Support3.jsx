import React from "react";
import "./Supports3.css";

import quality from "../../assets/trophy.png";
import warranty from "../../assets/Group.png";
import shipping from "../../assets/shipping.png";
import support from "../../assets/customer-support.png";

const Support3 = () => {
  return (
    <section className="supports-section">
      <div className="support-item">
        <img src={quality} alt="High Quality" />

        <div>
          <h3>High Quality</h3>
          <p>crafted from top materials</p>
        </div>
      </div>

      <div className="support-item">
        <img src={warranty} alt="Warranty Protection" />

        <div>
          <h3>Warranty Protection</h3>
          <p>Over 2 years</p>
        </div>
      </div>

      <div className="support-item">
        <img src={shipping} alt="Free Shipping" />

        <div>
          <h3>Free Shipping</h3>
          <p>Order over 150 $</p>
        </div>
      </div>

      <div className="support-item">
        <img src={support} alt="24 / 7 Support" />

        <div>
          <h3>24 / 7 Support</h3>
          <p>Dedicated support</p>
        </div>
      </div>
    </section>
  );
};

export default Support3;
