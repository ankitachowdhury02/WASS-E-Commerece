import React, { useEffect, useState } from "react";
import "./Products3.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import {
  Share2,
  ArrowLeftRight,
  Heart,
} from "lucide-react";

const Products3 = ({
  currentPage: externalPage,
  setCurrentPage: setExternalPage,
}) => {
  const { addToCart } = useCart();

  // =========================
  // API STATES
  // =========================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const [internalPage, setInternalPage] = useState(1);

  const currentPage =
    externalPage !== undefined
      ? externalPage
      : internalPage;

  const setCurrentPage =
    setExternalPage || setInternalPage;

  const productsPerPage = 16;

  // =========================
  // GET ALL PRODUCTS API
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://ecomm-qy13.onrender.com/api/products"
        );

        const data = await response.json();

        console.log(
          "Products API Response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load products"
          );
        }

        // ==================================
        // API RESPONSE HANDLE
        // ==================================

        let productList = [];

        // Case 1:
        // API directly returns array
        if (Array.isArray(data)) {
          productList = data;
        }

        // Case 2:
        // { products: [...] }
        else if (
          Array.isArray(data.products)
        ) {
          productList = data.products;
        }

        // Case 3:
        // { data: [...] }
        else if (
          Array.isArray(data.data)
        ) {
          productList = data.data;
        }

        // Case 4:
        // { result: [...] }
        else if (
          Array.isArray(data.result)
        ) {
          productList = data.result;
        }

        // Case 5:
        // Try to find an array inside object
        else if (
          data &&
          typeof data === "object"
        ) {
          const possibleArray = Object.values(
            data
          ).find((value) =>
            Array.isArray(value)
          );

          if (possibleArray) {
            productList = possibleArray;
          }
        }

        console.log(
          "Final Product List:",
          productList
        );

        setProducts(productList);

      } catch (error) {
        console.error(
          "Products API Error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong"
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // TOTAL PAGES
  // =========================

  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  // =========================
  // CURRENT PAGE PRODUCTS
  // =========================

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const endIndex =
    startIndex + productsPerPage;

  const currentProducts =
    products.slice(
      startIndex,
      endIndex
    );

  // =========================
  // PAGE CHANGE
  // =========================

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= totalPages &&
      page !== currentPage
    ) {
      setCurrentPage(page);

      const section =
        document.querySelector(
          ".products-section"
        );

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  };

  // =========================
  // PREVIOUS
  // =========================

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(
        currentPage - 1
      );
    }
  };

  // =========================
  // NEXT
  // =========================

  const nextPage = () => {
    if (
      currentPage < totalPages
    ) {
      handlePageChange(
        currentPage + 1
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="products-section">
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
          <h2>
            Loading products...
          </h2>
        </div>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <section className="products-section">
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
          <h2>
            Failed to load products
          </h2>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  // =========================
  // NO PRODUCTS
  // =========================

  if (products.length === 0) {
    return (
      <section className="products-section">
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
          <h2>
            No products available
          </h2>
        </div>
      </section>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <section className="products-section">

      {/* =========================
          PRODUCT GRID
      ========================= */}

      <div
        className="products-container"
        key={currentPage}
      >

        {currentProducts.map(
          (product) => {

            // =========================
            // PRICE
            // =========================

            const price = Number(
              product.price || 0
            );

            const discountPrice =
              Number(
                product.discountPrice || 0
              );

            const finalPrice =
              discountPrice > 0
                ? discountPrice
                : price;

            // =========================
            // DISCOUNT
            // =========================

            let badge = "";
            let badgeType = "";

            if (
              discountPrice > 0 &&
              discountPrice < price
            ) {
              const discount =
                Math.round(
                  ((price -
                    discountPrice) /
                    price) *
                    100
                );

              badge = `-${discount}%`;

              badgeType = "discount";
            }

            // =========================
            // CART PRODUCT
            // =========================

            const cartProduct = {
              ...product,

              image:
                product.images &&
                product.images.length > 0
                  ? product.images[0]
                  : "",

              price: `₹ ${finalPrice}`,

              oldPrice:
                discountPrice > 0 &&
                discountPrice < price
                  ? `₹ ${price}`
                  : "",
            };

            return (
              <div
                className="product-card"
                key={product.id}
              >

                {/* =====================
                    IMAGE
                ===================== */}

                <div className="product-image">

                  <Link
                    to={`/product/${product.id}`}
                  >

                    {product.images &&
                    product.images.length >
                      0 ? (

                      <img
                        src={
                          product.images[0]
                        }
                        alt={
                          product.name
                        }
                      />

                    ) : (

                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          background:
                            "#f5f5f5",
                          color: "#999",
                        }}
                      >
                        No Image
                      </div>

                    )}

                  </Link>

                  {/* BADGE */}

                  {badge && (
                    <span
                      className={`product-badge ${badgeType}`}
                    >
                      {badge}
                    </span>
                  )}

                  {/* =====================
                      HOVER OVERLAY
                  ===================== */}

                  <div className="product-overlay">

                    {/* ADD TO CART */}

                    <button
                      className="cart-button"
                      onClick={() => {

                        addToCart(
                          cartProduct
                        );

                        toast.success(
                          `${product.name} added to cart!`
                        );

                      }}
                    >
                      Add to cart
                    </button>

                    {/* ACTIONS */}

                    <div className="product-actions">

                      <button
                        className="action-btn"
                      >
                        <Share2
                          size={14}
                        />

                        <span>
                          Share
                        </span>
                      </button>

                      <button
                        className="action-btn"
                      >
                        <ArrowLeftRight
                          size={14}
                        />

                        <span>
                          Compare
                        </span>
                      </button>

                      <button
                        className="action-btn"
                      >
                        <Heart
                          size={14}
                        />

                        <span>
                          Like
                        </span>
                      </button>

                    </div>

                  </div>

                </div>

                {/* =====================
                    PRODUCT INFORMATION
                ===================== */}

                <Link
                  to={`/product/${product.id}`}
                  style={{
                    textDecoration:
                      "none",
                    color: "inherit",
                  }}
                >

                  <div className="product-info">

                    <h3>
                      {product.name}
                    </h3>

                    <p className="product-category">
                      {product.category}
                    </p>

                    <div className="product-price">

                      <strong>
                        ₹{" "}
                        {finalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      {discountPrice >
                        0 &&
                        discountPrice <
                          price && (
                          <del>
                            ₹{" "}
                            {price.toLocaleString(
                              "en-IN"
                            )}
                          </del>
                        )}

                    </div>

                  </div>

                </Link>

              </div>
            );
          }
        )}

      </div>

      {/* =========================
          PAGINATION
      ========================= */}

      {totalPages > 1 && (
        <div className="pagination">

          {/* PREVIOUS */}

          {currentPage > 1 && (
            <button
              className="prev-btn"
              onClick={prevPage}
            >
              Prev
            </button>
          )}

          {/* PAGE NUMBERS */}

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) =>
              index + 1
          ).map((page) => (

            <button
              key={page}
              className={
                currentPage === page
                  ? "active"
                  : ""
              }
              onClick={() =>
                handlePageChange(
                  page
                )
              }
            >
              {page}
            </button>

          ))}

          {/* NEXT */}

          <button
            className="next-btn"
            onClick={nextPage}
            disabled={
              currentPage ===
              totalPages
            }
          >
            Next
          </button>

        </div>
      )}

    </section>
  );
};

export default Products3;