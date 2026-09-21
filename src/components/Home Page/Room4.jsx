import React, { useState } from "react";
import "./Room4.css";
import { ArrowRight, ChevronRight } from "lucide-react";

import bedroom from "../../assets/Inner Peace.png";
import living from "../../assets/Modern Living.png";
import dining from "../../assets/Dining Space.png";
import bedroom2 from "../../assets/Decorate room.png";

const Room4 = () => {
  const rooms = [
    {
      image: bedroom,
      number: "01",
      type: "Bed Room",
      title: "Inner Peace",
    },
    {
      image: living,
      number: "02",
      type: "Living Room",
      title: "Modern Living",
    },
    {
      image: dining,
      number: "03",
      type: "Dining Room",
      title: "Dining Space",
    },
    {
      image: bedroom2,
      number: "04",
      type: "Bed Room",
      title: "Comfort Zone",
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % rooms.length);
  };

  const nextIndex1 = (current + 1) % rooms.length;
  const nextIndex2 = (current + 2) % rooms.length;

  return (
    <section className="room-section">
   
      <div className="room-text">
        <h2>
          50+ Beautiful rooms
          <br />
          inspiration
        </h2>

        <p>
          Our designer already made a lot of beautiful
          <br />
          prototipe of rooms that inspire you
        </p>

        <button className="room-explore-btn">Explore More</button>
      </div>

      <div className="room-slider-container">
        <div className="room-slider-top">
        
          <div className="room-active-slide">
            <img
              src={rooms[current].image}
              alt={rooms[current].title}
              key={current}
              className="active-slide-img"
            />

            
            <div className="room-info-card">
              <div className="room-info-content">
                <div className="room-info-meta">
                  <span>{rooms[current].number}</span>
                  <span className="meta-dash">——</span>
                  <span>{rooms[current].type}</span>
                </div>
                <h3>{rooms[current].title}</h3>
              </div>

              <button
                className="room-card-arrow"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>

        
          <div className="room-upcoming-track">
            <div
              className="room-upcoming-slide slide-first"
              onClick={nextSlide}
            >
              <img
                src={rooms[nextIndex1].image}
                alt={rooms[nextIndex1].title}
              />
            </div>

            <div
              className="room-upcoming-slide slide-second"
              onClick={() => setCurrent(nextIndex2)}
            >
              <img
                src={rooms[nextIndex2].image}
                alt={rooms[nextIndex2].title}
              />
            </div>

            <button
              className="slider-nav-btn next-btn"
              onClick={nextSlide}
              aria-label="Next room inspiration"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>


        <div className="room-dots">
          {rooms.map((_, index) => (
            <div
              key={index}
              className={`dot-wrapper ${current === index ? "active" : ""}`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              role="button"
              tabIndex={0}
            >
              <span className="dot-inner"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Room4;
