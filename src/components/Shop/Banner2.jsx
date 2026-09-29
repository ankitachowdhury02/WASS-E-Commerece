import React, { useState } from "react";
import { SlidersHorizontal, Grid2X2, List, X, Check } from "lucide-react";

import "./Banner2.css";

const CATEGORIES = [
  { label: "All Categories", value: "" },
  { label: "Sofas", value: "SOFAS" },
  { label: "Chairs", value: "CHAIRS" },
  { label: "Tables", value: "TABLES" },
  { label: "Decor", value: "DECOR" },
];

const Banner2 = ({
  currentPage = 1,
  setCurrentPage,
  productsPerPage = 16,
  setProductsPerPage,
  totalProducts = 0,
  sortBy = "default",
  setSortBy,
  category = "",
  setCategory,
  viewMode = "grid",
  setViewMode,
}) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

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

  const handleCategoryChange = (event) => {
    if (setCategory) {
      setCategory(event.target.value);
    }
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  };

  const handleCategorySelect = (val) => {
    if (setCategory) {
      setCategory(val);
    }
    if (setCurrentPage) {
      setCurrentPage(1);
    }
    setFilterDrawerOpen(false);
  };

  return (
    <>
      <section className="filter-bar banner2">
        <div className="filter-left">
          <button
            className={`filter-btn ${category ? "active-filter" : ""}`}
            type="button"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            title="Filter by category"
          >
            <SlidersHorizontal size={20} />
            <span>Filter{category ? `: ${category}` : ""}</span>
          </button>

          <button
            className={`icon-btn ${viewMode === "grid" ? "active" : ""}`}
            type="button"
            onClick={() => setViewMode && setViewMode("grid")}
            title="Grid view"
          >
            <Grid2X2 size={20} />
          </button>

          <button
            className={`icon-btn ${viewMode === "list" ? "active" : ""}`}
            type="button"
            onClick={() => setViewMode && setViewMode("list")}
            title="List view"
          >
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
          {/* CATEGORY SELECT */}
          <div className="category-box">
            <span>Category</span>
            <select value={category} onChange={handleCategoryChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* SHOW PER PAGE */}
          <div className="show-box">
            <span>Show</span>
            <select value={productsPerPage} onChange={handleShowChange}>
              <option value={10}>10</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
              <option value={32}>32</option>
            </select>
          </div>

          {/* SORT BY */}
          <div className="sort-box">
            <span>Sort by</span>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="default">Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
            </select>
          </div>
        </div>
      </section>

      {/* FILTER DRAWER / MODAL FOR MOBILE & CONVENIENCE */}
      {filterDrawerOpen && (
        <div
          className="filter-drawer-overlay"
          onClick={() => setFilterDrawerOpen(false)}
        >
          <div
            className="filter-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-drawer-header">
              <h3>Filter Products</h3>
              <button
                className="close-drawer-btn"
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="filter-drawer-body">
              <h4>Category</h4>
              <div className="category-pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-pill ${category === cat.value ? "active" : ""}`}
                    onClick={() => handleCategorySelect(cat.value)}
                  >
                    <span>{cat.label}</span>
                    {category === cat.value && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {category && (
              <div className="filter-drawer-footer">
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={() => handleCategorySelect("")}
                >
                  Clear Category Filter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Banner2;
