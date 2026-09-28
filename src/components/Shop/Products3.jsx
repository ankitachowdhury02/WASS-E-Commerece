import React, { useEffect, useState, useMemo } from "react";
import "./Products3.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";

import {
  Share2,
  ArrowLeftRight,
  Heart,
  Search,
  X,
} from "lucide-react";

const Products3 = ({
  currentPage: externalPage,
  setCurrentPage: setExternalPage,
  sortBy: externalSortBy,
  setSortBy: setExternalSortBy,
  productsPerPage: externalPerPage = 16,
  onTotalProductsChange,
}) => {
  const { addToCart } = useCart();

  // =========================
  // API STATES
  // =========================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // SEARCH STATES
  // =========================
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // =========================
  // SORT STATES (Internal fallback if not provided via props)
  // =========================
  const [internalSortBy, setInternalSortBy] = useState("default");
  const sortBy = externalSortBy !== undefined ? externalSortBy : internalSortBy;
  const setSortBy = setExternalSortBy || setInternalSortBy;

  // =========================
  // PAGINATION (Internal fallback if not provided via props)
  // =========================
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = externalPage !== undefined ? externalPage : internalPage;
  const setCurrentPage = setExternalPage || setInternalPage;
  const productsPerPage = externalPerPage || 16;

  // =========================
  // HELPER: GET NUMERIC EFFECTIVE PRICE
  // =========================
  const getProductPrice = (product) => {
    const price = parseFloat(product?.price) || 0;
    const discountPrice = parseFloat(product?.discountPrice) || 0;
    return discountPrice > 0 && discountPrice < price ? discountPrice : price;
  };

  // =========================
  // FETCH PRODUCTS ONCE ON MOUNT
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://ecomm-qy13.onrender.com/api/products?limit=100"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load products"
          );
        }

        let productList = [];

        if (Array.isArray(data)) {
          productList = data;
        } else if (Array.isArray(data.products)) {
          productList = data.products;
        } else if (Array.isArray(data.data)) {
          productList = data.data;
        } else if (Array.isArray(data.result)) {
          productList = data.result;
        } else if (data && typeof data === "object") {
          const possibleArray = Object.values(data).find((value) =>
            Array.isArray(value)
          );
          if (possibleArray) {
            productList = possibleArray;
          }
        }

        if (isMounted) {
          setProducts(productList);
        }
      } catch (err) {
        console.error("Products API Error:", err);
        if (isMounted) {
          setError(err.message || "Something went wrong while loading products.");
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // DERIVED FILTERED & SORTED PRODUCTS (useMemo)
  // =========================
  const filteredAndSortedProducts = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    let result = products;

    // 1. FILTER BY SEARCH
    if (cleanSearch) {
      result = products.filter((product) => {
        const name = String(product?.name || "").toLowerCase();
        const category = String(product?.category || "").toLowerCase();
        const description = String(product?.description || "").toLowerCase();
        const sku = String(product?.sku || "").toLowerCase();

        // Exact or partial string match
        if (
          name.includes(cleanSearch) ||
          category.includes(cleanSearch) ||
          description.includes(cleanSearch) ||
          sku.includes(cleanSearch)
        ) {
          return true;
        }

        // Multi-word search
        const words = cleanSearch.split(/\s+/).filter(Boolean);
        if (words.length > 1) {
          return words.every(
            (word) =>
              name.includes(word) ||
              category.includes(word) ||
              description.includes(word) ||
              sku.includes(word)
          );
        }

        return false;
      });
    }

    // 2. SORTING (Never mutate original array)
    const sorted = [...result];

    if (sortBy === "name-asc") {
      sorted.sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || ""), undefined, {
          sensitivity: "base",
          numeric: true,
        })
      );
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) =>
        String(b?.name || "").localeCompare(String(a?.name || ""), undefined, {
          sensitivity: "base",
          numeric: true,
        })
      );
    } else if (sortBy === "price-asc") {
      sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    }

    return sorted;
  }, [products, searchTerm, sortBy]);

  // =========================
  // SYNC FILTERED COUNT WITH PARENT (Banner2)
  // =========================
  useEffect(() => {
    if (onTotalProductsChange) {
      onTotalProductsChange(filteredAndSortedProducts.length);
    }
  }, [filteredAndSortedProducts.length, onTotalProductsChange]);

  // =========================
  // SEARCH HANDLERS
  // =========================
  // Immediate search as user types
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // =========================
  // PAGINATION CALCULATIONS
  // =========================
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const currentProducts = filteredAndSortedProducts.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= totalPages &&
      page !== currentPage
    ) {
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
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <section className="products-section">
        <div className="product-search-box">
          <form onSubmit={handleSearch} className="product-search-form">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            {searchInput && (
              <button
                type="button"
                className="clear-search-button"
                onClick={handleClearSearch}
              >
                <X size={18} />
              </button>
            )}
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Loading products...</h2>
        </div>
      </section>
    );
  }

  // =========================
  // ERROR STATE
  // =========================
  if (error) {
    return (
      <section className="products-section">
        <div className="product-search-box">
          <form onSubmit={handleSearch} className="product-search-form">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Failed to load products</h2>
          <p>{error}</p>
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
          SEARCH BOX
      ========================= */}
      <div className="product-search-box">
        <form onSubmit={handleSearch} className="product-search-form">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchChange}
          />

          {searchInput && (
            <button
              type="button"
              className="clear-search-button"
              onClick={handleClearSearch}
            >
              <X size={18} />
            </button>
          )}

          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {/* =========================
          SEARCH RESULT TEXT
      ========================= */}
      {searchTerm.trim() && (
        <div className="search-result-text">
          <p>
            Search results for:
            <strong> "{searchTerm.trim()}"</strong>
          </p>

          <span>
            {filteredAndSortedProducts.length} product
            {filteredAndSortedProducts.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* =========================
          PRODUCT LIST OR EMPTY STATE
      ========================= */}
      {filteredAndSortedProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>No products found</h2>

          {searchTerm.trim() && (
            <p>No product found for "{searchTerm.trim()}"</p>
          )}

          {searchTerm.trim() && (
            <button
              className="clear-all-search-button"
              onClick={handleClearSearch}
            >
              View All Products
            </button>
          )}
        </div>
      ) : (
        <>
          {/* =========================
              PRODUCT GRID
          ========================= */}
          <div className="products-container" key={currentPage}>
            {currentProducts.map((product) => {
              const price = Number(product.price || 0);
              const discountPrice = Number(product.discountPrice || 0);
              const finalPrice =
                discountPrice > 0 ? discountPrice : price;

              let badge = "";
              let badgeType = "";

              if (discountPrice > 0 && discountPrice < price) {
                const discount = Math.round(
                  ((price - discountPrice) / price) * 100
                );
                badge = `-${discount}%`;
                badgeType = "discount";
              }

              const cartProduct = {
                ...product,
                image:
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "",
                price: `₹ ${finalPrice}`,
                oldPrice:
                  discountPrice > 0 && discountPrice < price
                    ? `₹ ${price}`
                    : "",
              };

              return (
                <div className="product-card" key={product.id}>
                  {/* IMAGE */}
                  <div className="product-image">
                    <Link to={`/product/${product.id}`}>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f5f5f5",
                            color: "#999",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </Link>

                    {/* BADGE */}
                    {badge && (
                      <span className={`product-badge ${badgeType}`}>
                        {badge}
                      </span>
                    )}

                    {/* HOVER OVERLAY */}
                    <div className="product-overlay">
                      {/* ADD TO CART */}
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

                      {/* ACTIONS */}
                      <div className="product-actions">
                        <button className="action-btn" type="button">
                          <Share2 size={14} />
                          <span>Share</span>
                        </button>

                        <button className="action-btn" type="button">
                          <ArrowLeftRight size={14} />
                          <span>Compare</span>
                        </button>

                        <button className="action-btn" type="button">
                          <Heart size={14} />
                          <span>Like</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
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
                          ₹ {finalPrice.toLocaleString("en-IN")}
                        </strong>

                        {discountPrice > 0 &&
                          discountPrice < price && (
                            <del>
                              ₹ {price.toLocaleString("en-IN")}
                            </del>
                          )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
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
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  className={
                    currentPage === page ? "active" : ""
                  }
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* NEXT */}
              <button
                className="next-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Products3;