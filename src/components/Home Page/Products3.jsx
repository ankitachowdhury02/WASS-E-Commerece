import React, { useEffect, useState } from "react";
import "./Products3.css";
import { Link } from "react-router-dom";
import ProductCard from "../Common/ProductCard";
import { fallbackProducts } from "../../data/fallbackProducts";

const Products3 = () => {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  // Fetch the same live product data used on the Shop page
  useEffect(() => {
    let isMounted = true;

    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://ecomm-qy13.onrender.com/api/products?limit=8"
        );

        if (response.ok) {
          const data = await response.json();
          let productList = [];

          if (Array.isArray(data)) {
            productList = data;
          } else if (Array.isArray(data.products)) {
            productList = data.products;
          } else if (Array.isArray(data.data)) {
            productList = data.data;
          } else if (Array.isArray(data.result)) {
            productList = data.result;
          }

          if (productList.length > 0 && isMounted) {
            setProducts(productList.slice(0, 8));
          }
        }
      } catch (err) {
        console.error("Home products fetch error, using fallback data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomeProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="products-section">
      <h2 className="products-title">Our Products</h2>

      <div className="products-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Link to="/shop" className="show-more">
        Show More
      </Link>
    </section>
  );
};

export default Products3;
