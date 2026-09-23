import React from "react";
import {
  SlidersHorizontal,
  Grid2X2,
  List,
} from "lucide-react";

import "./Banner2.css";

const Banner2 = () => {
  return (
    <section className="filter-bar banner2">

      <div className="filter-left">

        <button className="filter-btn">
          <SlidersHorizontal size={20} />
          <span>Filter</span>
        </button>

        <button className="icon-btn">
          <Grid2X2 size={20} />
        </button>

        <button className="icon-btn">
          <List size={22} />
        </button>

        <div className="vertical-line"></div>

        <p>Showing 1–16 of 32 results</p>

      </div>


     
      <div className="filter-right">

        <div className="show-box">
          <span>Show</span>

          <select>
            <option>16</option>
            <option>24</option>
            <option>32</option>
          </select>
        </div>


        <div className="sort-box">
          <span>Short by</span>

          <select>
            <option>Default</option>
            <option>Price</option>
            <option>Name</option>
          </select>
        </div>

      </div>

    </section>
  );
};

export default Banner2;