import React, { useState } from "react";

import Banner1 from "../components/Shop/Banner1";
import Products3 from "../components/Shop/Products3";
import Banner2 from "../components/Shop/Banner2";

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [productsPerPage, setProductsPerPage] = useState(16);
  const [totalProducts, setTotalProducts] = useState(0);

  return (
    <div>
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
      />
    </div>
  );
};

export default Shop;