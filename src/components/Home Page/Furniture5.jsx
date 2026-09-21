import React from "react";
import "./Furniture5.css";

import balconyImg from "../../assets/Balcony.png";
import laptopImg from "../../assets/Laptop.png";
import chairImg from "../../assets/Chair.png";
import stoolsImg from "../../assets/stools.png";
import lampImg from "../../assets/Lamp.png";
import bedroomImg from "../../assets/Decorate room.png";
import breakfastImg from "../../assets/breakfast.png";
import vaseImg from "../../assets/Flowervase.png";
import kitchenImg from "../../assets/Kitchen.png";

const Furniture5 = () => {
  return (
    <section className="furniture-section">
      <div className="furniture-heading">
        <p>Share your setup with</p>
        <h2>#FuniroFurniture</h2>
      </div>

      <div className="furniture-gallery-wrapper">
        <div className="furniture-gallery">
          
          <div className="gallery-wing left-wing">
            <div className="wing-row top-row">
              <div className="gallery-item item-shelf">
                <img src={balconyImg} alt="Shelf setup" />
              </div>
              <div className="gallery-item item-laptop">
                <img src={laptopImg} alt="Laptop workspace" />
              </div>
            </div>

            <div className="wing-row bottom-row">
              <div className="gallery-item item-chair">
                <img src={chairImg} alt="Vintage chair" />
              </div>
              <div className="gallery-item item-stools">
                <img src={stoolsImg} alt="Stools with vase and camera" />
              </div>
            </div>
          </div>

          <div className="gallery-center">
            <div className="gallery-item item-center">
              <img src={lampImg} alt="Dining setup" />
            </div>
          </div>

          <div className="gallery-wing right-wing">
            <div className="wing-row top-row">
              <div className="gallery-item item-bedroom">
                <img src={bedroomImg} alt="Bedroom setup" />
              </div>
              <div className="gallery-item item-breakfast">
                <img src={breakfastImg} alt="Dining room with brick wall" />
              </div>
            </div>

            <div className="wing-row bottom-row">
              <div className="gallery-item item-vase">
                <img src={vaseImg} alt="Wall frame and vase" />
              </div>
              <div className="gallery-item item-kitchen">
                <img src={kitchenImg} alt="Kitchen stove" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Furniture5;