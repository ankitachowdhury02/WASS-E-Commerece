import React from "react";
import "./Banner1.css";

import contactBg from "../../assets/Contact Banner.png";
import logo from "../../assets/furniro-logo.png";

const Banner1 = () => {
  return (
    <section
      className="contact-banner"
      style={{ backgroundImage: `url(${contactBg})` }}
    >
      <div className="contact-overlay">
        <img src={logo} alt="Furniro" className="contact-logo" />

        <h1>Contact</h1>

        <div className="contact-breadcrumb">
          <span>Home</span>
          <span className="arrow">›</span>
          <span>Contact</span>
        </div>
      </div>
    </section>
  );
};

export default Banner1;
