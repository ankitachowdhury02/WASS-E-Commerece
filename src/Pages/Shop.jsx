import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Banner1 from "../components/Shop/Banner1";
import Products3 from "../components/Shop/Products3";
import Banner2 from "../components/Shop/Banner2";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize states from URL parameters (e.g. ?search=sofa&category=SOFAS&page=1&limit=10&sort=price_asc)
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 16;
  const initialSort = searchParams.get("sort") || "default";
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState(initialSort);
  const [productsPerPage, setProductsPerPage] = useState(initialLimit);
  const [totalProducts, setTotalProducts] = useState(0);
  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [viewMode, setViewMode] = useState("grid");

  // Keep URL search parameters synced with filters and sort
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }
    if (category.trim()) {
      params.set("category", category.trim());
    }
    if (currentPage > 1) {
      params.set("page", String(currentPage));
    }
    if (productsPerPage && productsPerPage !== 16) {
      params.set("limit", String(productsPerPage));
    }
    if (sortBy && sortBy !== "default") {
      params.set("sort", sortBy);
    }

    setSearchParams(params, { replace: true });
  }, [searchTerm, category, currentPage, productsPerPage, sortBy, setSearchParams]);

  // Sync state if user navigates back/forward in browser history
  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlLimit = Number(searchParams.get("limit")) || 16;
    const urlSort = searchParams.get("sort") || "default";
    const urlCat = searchParams.get("category") || "";
    const urlSearch = searchParams.get("search") || "";

    setCurrentPage((prev) => (prev !== urlPage ? urlPage : prev));
    setProductsPerPage((prev) => (prev !== urlLimit ? urlLimit : prev));
    setSortBy((prev) => (prev !== urlSort ? urlSort : prev));
    setCategory((prev) => (prev !== urlCat ? urlCat : prev));
    setSearchTerm((prev) => (prev !== urlSearch ? urlSearch : prev));
  }, [searchParams]);

  return (
    <div className="shop-page">
      {/* =========================
          SHOP BANNER
      ========================= */}
      <Banner1 />

      {/* =========================
          SHOP FILTER / INFO BANNER
      ========================= */}
      <Banner2
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
        setProductsPerPage={setProductsPerPage}
        totalProducts={totalProducts}
        sortBy={sortBy}
        setSortBy={setSortBy}
        category={category}
        setCategory={setCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* =========================
          PRODUCTS
      ========================= */}
      <Products3
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sortBy={sortBy}
        setSortBy={setSortBy}
        productsPerPage={productsPerPage}
        onTotalProductsChange={setTotalProducts}
        category={category}
        setCategory={setCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
      />
    </div>
  );
};

export default Shop;