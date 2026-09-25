import React from "react";
import "./Browser2.css";
import diningImg from "../../assets/dining.png";
import livingImg from "../../assets/living room.png";
import bedroomImg from "../../assets/bedroom.png";

const Browser2 = () => {
  return (
    <section className="browse-section">

      <div className="browse-heading">
        <h2>Browse The Range</h2>
        <p>Explore our collection of beautifully crafted furniture designed to bring comfort and style to every room.</p>
      </div>

      <div className="browse-container">

        <div className="browse-card">
          <div className="browse-img-wrapper">
            <img src={diningImg} alt="Dining" />
          </div>
          <h3>Dining</h3>
        </div>


        <div className="browse-card">
          <div className="browse-img-wrapper">
            <img src={livingImg} alt="Living" />
          </div>
          <h3>Living</h3>
        </div>


        <div className="browse-card">
          <div className="browse-img-wrapper">
            <img src={bedroomImg} alt="Bedroom" />
          </div>
          <h3>Bedroom</h3>
        </div>
      </div>
    </section>
  );
};

export default Browser2;