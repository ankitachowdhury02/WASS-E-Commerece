import React from "react";
import "./Getintouch2.css";

import location from "../../assets/location.png";
import phone from "../../assets/phone.png";
import waiting from "../../assets/waiting.png";

const Getintouch2 = () => {
  return (
    <section className="get-touch-section">
      <div className="get-touch-heading">
        <h2>Get In Touch With Us</h2>

        <p>
          For More Information About Our Product & Services, Please Feel Free To
          Drop Us
          <br />
          An Email. Our Staff Always Be There To Help You Out. Do Not Hesitate!
        </p>
      </div>

      <div className="get-touch-container">
        <div className="contact-info">
          <div className="info-box">
            <img src={location} alt="Location" />

            <div>
              <h3>Address</h3>

              <p>
                Sector 5, 
                <br />
                Kolkata, 700091
                <br />
                West Bengal, India
              </p>
            </div>
          </div>

          <div className="info-box">
            <img src={phone} alt="Phone" />

            <div>
              <h3>Phone</h3>

              <p>
                Mobile: +91 6294373448
                <br />
                Mobile: +91 9933906020
              </p>
            </div>
          </div>

          <div className="info-box">
            <img src={waiting} alt="Working Time" />

            <div>
              <h3>Working Time</h3>

              <p>
                Monday-Friday: 9:00 -
                <br />
                22:00
                <br />
                Saturday-Sunday: 9:00 -
                <br />
                21:00
              </p>
            </div>
          </div>
        </div>

        <form className="contact-form">
          <label>Your name</label>
          <input type="text" placeholder="Abc" />

          <label>Email address</label>
          <input type="email" placeholder="Abc@def.com" />

          <label>Subject</label>
          <input type="text" placeholder="This is an optional" />

          <label>Message</label>
          <textarea placeholder="Hi! I'd like to ask about"></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default Getintouch2;
