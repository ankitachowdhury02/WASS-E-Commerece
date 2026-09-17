import React from 'react';
import './Banner1.css';
import homeBanner from '../../assets/homebanner.png';

const Banner1 = () => {
  return (
    <section className="banner">
      <img
        className="banner-image"
        src={homeBanner}
        alt="Furniro New Collection"
      />

      <div className="banner-card">
        <p className="banner-card-subtitle">New Arrival</p>
        <h1 className="banner-card-title">
          Discover Our
          <br />
          New Collection
        </h1>
        <p className="banner-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis.
        </p>
        <button className="banner-button">
          BUY NOW
        </button>
      </div>
    </section>
  );
};

export default Banner1;
