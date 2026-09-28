import React from "react";
import { SlidersHorizontal, Grid2X2, List } from "lucide-react";

import "./Banner2.css";

const Banner2 = ({
  currentPage = 1,
  setCurrentPage,
  productsPerPage = 16,
  setProductsPerPage,
  totalProducts = 0,
  sortBy = "default",
  setSortBy,
}) => {
  const startItem =
    totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const endItem = Math.min(currentPage * productsPerPage, totalProducts);

  const handleSortChange = (event) => {
    if (setSortBy) {
      setSortBy(event.target.value);
    }
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  };

  const handleShowChange = (event) => {
    if (setProductsPerPage) {
      setProductsPerPage(Number(event.target.value));
    }
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  };

  return (
    <section className="filter-bar banner2">
      <div className="filter-left">
        <button className="filter-btn" type="button">
          <SlidersHorizontal size={20} />
          <span>Filter</span>
        </button>

        <button className="icon-btn" type="button">
          <Grid2X2 size={20} />
        </button>

        <button className="icon-btn" type="button">
          <List size={22} />
        </button>

        <div className="vertical-line"></div>

        <p>
          {totalProducts === 0
            ? "Showing 0 results"
            : `Showing ${startItem}–${endItem} of ${totalProducts} results`}
        </p>
      </div>

      <div className="filter-right">
        <div className="show-box">
          <span>Show</span>

          <select value={productsPerPage} onChange={handleShowChange}>
            <option value={16}>16</option>
            <option value={24}>24</option>
            <option value={32}>32</option>
          </select>
        </div>

        <div className="sort-box">
          <span>Sort by</span>

          <select value={sortBy} onChange={handleSortChange}>
            <option value="default">Default</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default Banner2;
