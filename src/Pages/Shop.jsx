import React, { useState } from "react";

import Banner1 from "../components/Shop/Banner1";
import Products3 from "../components/Shop/Products3";
import Banner2 from "../components/Shop/Banner2";

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const totalProducts = 48;

  return (
    <div>
      <Banner1 />

      <Banner2
        currentPage={currentPage}
        productsPerPage={productsPerPage}
        totalProducts={totalProducts}
      />

      <Products3
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Shop;