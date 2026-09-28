import React, { useEffect, useState } from "react";
import "./Products3.css";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { Share2, ArrowLeftRight, Heart } from "lucide-react";

const Products3 = ({
  currentPage: externalPage,
  setCurrentPage: setExternalPage,
}) => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [internalPage, setInternalPage] = useState(1);

  const currentPage =
    externalPage !== undefined ? externalPage : internalPage;

  const setCurrentPage = setExternalPage || setInternalPage;

  const productsPerPage = 16;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://ecomm-qy13.onrender.com/api/products"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        console.log("Products API Response:", data);

        setProducts(data);
      } catch (error) {
        console.error("Products Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);

      const section = document.querySelector(".products-section");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  };

  const prevPage = () => {
    handlePageChange(currentPage - 1);
  };

  const nextPage = () => {
    handlePageChange(currentPage + 1);
  };

  if (loading) {
    return (
      <section className="products-section">
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h2>Loading products...</h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h2>Failed to load products</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="products-section">
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h2>No products available</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">

      <div className="products-container" key={currentPage}>

        {currentProducts.map((product) => {

          const price = Number(product.price || 0);
          const discountPrice = Number(product.discountPrice || 0);

          let badge = "";
          let badgeType = "";

          if (discountPrice > 0 && discountPrice < price) {
            const discount =
              Math.round(((price - discountPrice) / price) * 100);

            badge = `-${discount}%`;
            badgeType = "discount";
          }

          const cartProduct = {
            ...product,
            image: product.images?.[0] || "",
            price: `₹ ${discountPrice > 0 ? discountPrice : price}`,
            oldPrice:
              discountPrice > 0 && discountPrice < price
                ? `₹ ${price}`
                : "",
          };

          return (
            <div className="product-card" key={product.id}>

              <div className="product-image">

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                  />
                </Link>

                {badge && (
                  <span className={`product-badge ${badgeType}`}>
                    {badge}
                  </span>
                )}

                <div className="product-overlay">

                  <button
                    className="cart-button"
                    onClick={() => {
                      addToCart(cartProduct);

                      toast.success(
                        `${product.name} added to cart!`
                      );
                    }}
                  >
                    Add to cart
                  </button>

                  <div className="product-actions">

                    <button className="action-btn">
                      <Share2 size={14} />
                      <span>Share</span>
                    </button>

                    <button className="action-btn">
                      <ArrowLeftRight size={14} />
                      <span>Compare</span>
                    </button>

                    <button className="action-btn">
                      <Heart size={14} />
                      <span>Like</span>
                    </button>

                  </div>
                </div>
              </div>

              <Link
                to={`/product/${product.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="product-info">

                  <h3>{product.name}</h3>

                  <p className="product-category">
                    {product.category}
                  </p>

                  <div className="product-price">

                    <strong>
                      ₹{" "}
                      {discountPrice > 0
                        ? discountPrice
                        : price}
                    </strong>

                    {discountPrice > 0 &&
                      discountPrice < price && (
                        <del>₹ {price}</del>
                      )}

                  </div>

                </div>
              </Link>

            </div>
          );
        })}

      </div>

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="pagination">

          {currentPage > 1 && (
            <button
              className="prev-btn"
              onClick={prevPage}
            >
              Prev
            </button>
          )}

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="next-btn"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>

        </div>
      )}

    </section>
  );
};

export default Products3;