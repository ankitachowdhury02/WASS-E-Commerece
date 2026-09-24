import React from "react";
import "./Banner1.css";
import contactBg from "../../assets/Contact Banner.png";
import logo from "../../assets/logo-icon.png";

const Banner1 = () => {
  return (
    <section
      className="contact-banner"
      style={{ backgroundImage: `url(${contactBg})` }}
    >
      <div className="contact-overlay">
        <img src={logo} alt="Furniro Logo Icon" className="contact-logo" />

        <h1>Product Comparison</h1>

        <div className="contact-breadcrumb">
          <span className="crumb-home">Home</span>
          <span className="arrow">›</span>
          <span className="crumb-current">Product Comparison</span>
        </div>
      </div>
    </section>
  );
};

export default Banner1;
