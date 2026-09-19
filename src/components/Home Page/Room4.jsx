import React, { useState } from "react";
import "./Room4.css";

import { MoveRight } from "lucide-react";

import bedroom from "../../assets/Inner Peace.png";
import living from "../../assets/Modern Living.png";
import dining from "../../assets/Dining Space.png";

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
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((current + 1) % rooms.length);
  };

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
          prototype of rooms that inspire you.
        </p>

        <button>Explore More</button>
      </div>

      <div className="room-slider">
        <div className="room-image">
          <img src={rooms[current].image} alt={rooms[current].title} />

          <div className="room-info">
            <div className="room-info-top">
              <span>{rooms[current].number}</span>

              <span>—</span>

              <span>{rooms[current].type}</span>
            </div>

            <h3>{rooms[current].title}</h3>
          </div>
        </div>

        <div className="room-next">
          <img
            src={rooms[(current + 1) % rooms.length].image}
            alt={rooms[(current + 1) % rooms.length].title}
          />

          <button
            className="next-button"
            onClick={nextSlide}
            aria-label="Next room"
          >
            <MoveRight size={20} />
          </button>
        </div>

        <div className="room-dots">
          {rooms.map((room, index) => (
            <span
              key={index}
              className={current === index ? "dot active" : "dot"}
              onClick={() => setCurrent(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Room4;
