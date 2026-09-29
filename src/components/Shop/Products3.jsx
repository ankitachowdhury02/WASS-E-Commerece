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
  RotateCcw,
} from "lucide-react";

// Helper to map UI sort keys to API query parameter
const mapSortForApi = (sort) => {
  if (sort === "price_asc" || sort === "price-asc") return "price_asc";
  if (sort === "price_desc" || sort === "price-desc") return "price_desc";
  if (sort === "name_asc" || sort === "name-asc") return "name_asc";
  if (sort === "name_desc" || sort === "name-desc") return "name_desc";
  return "";
};

const getSortLabel = (sort) => {
  if (sort === "price_asc" || sort === "price-asc") return "Price: Low to High";
  if (sort === "price_desc" || sort === "price-desc") return "Price: High to Low";
  if (sort === "name_asc" || sort === "name-asc") return "Name: A → Z";
  if (sort === "name_desc" || sort === "name-desc") return "Name: Z → A";
  return "Default";
};

const Products3 = ({
  currentPage: externalPage,
  setCurrentPage: setExternalPage,
  sortBy: externalSortBy,
  setSortBy: setExternalSortBy,
  productsPerPage: externalPerPage = 16,
  onTotalProductsChange,
  category: externalCategory,
  setCategory: setExternalCategory,
  searchTerm: externalSearchTerm,
  setSearchTerm: setExternalSearchTerm,
  viewMode = "grid",
}) => {
  const { addToCart } = useCart();

  // =========================
  // API STATES
  // =========================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // =========================
  // SEARCH STATES
  // =========================
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const searchTerm =
    externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const setSearchTerm = setExternalSearchTerm || setInternalSearchTerm;

  const [searchInput, setSearchInput] = useState(searchTerm || "");

  // =========================
  // CATEGORY STATES
  // =========================
  const [internalCategory, setInternalCategory] = useState("");
  const category =
    externalCategory !== undefined ? externalCategory : internalCategory;
  const setCategory = setExternalCategory || setInternalCategory;

  // =========================
  // SORT STATES
  // =========================
  const [internalSortBy, setInternalSortBy] = useState("default");
  const sortBy = externalSortBy !== undefined ? externalSortBy : internalSortBy;
  const setSortBy = setExternalSortBy || setInternalSortBy;

  // =========================
  // PAGINATION
  // =========================
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = externalPage !== undefined ? externalPage : internalPage;
  const setCurrentPage = setExternalPage || setInternalPage;
  const productsPerPage = externalPerPage || 16;

  // Sync search input when external search term changes
  useEffect(() => {
    setSearchInput(searchTerm || "");
  }, [searchTerm]);

  // Debounced search when user types in the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
        if (setCurrentPage) {
          setCurrentPage(1);
        }
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, searchTerm, setSearchTerm, setCurrentPage]);

  // =========================
  // FETCH PRODUCTS FROM API
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Build query string matching:
        // https://ecomm-qy13.onrender.com/api/products?search=...&category=...&page=...&limit=...&sort=...
        const queryParams = new URLSearchParams();

        if (searchTerm && searchTerm.trim()) {
          queryParams.append("search", searchTerm.trim());
        }

        if (category && category !== "ALL" && category.trim()) {
          queryParams.append("category", category.trim());
        }

        if (currentPage) {
          queryParams.append("page", String(currentPage));
        }

        if (productsPerPage) {
          queryParams.append("limit", String(productsPerPage));
        }

        const apiSort = mapSortForApi(sortBy);
        if (apiSort) {
          queryParams.append("sort", apiSort);
        }

        const apiUrl = `https://ecomm-qy13.onrender.com/api/products?${queryParams.toString()}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load products");
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

        // Alphabetical sort fallback in case backend only sorts by price
        if (sortBy === "name_asc" || sortBy === "name-asc") {
          productList = [...productList].sort((a, b) =>
            String(a?.name || "").localeCompare(String(b?.name || ""), undefined, {
              sensitivity: "base",
              numeric: true,
            })
          );
        } else if (sortBy === "name_desc" || sortBy === "name-desc") {
          productList = [...productList].sort((a, b) =>
            String(b?.name || "").localeCompare(String(a?.name || ""), undefined, {
              sensitivity: "base",
              numeric: true,
            })
          );
        }

        // Pagination metadata
        const total =
          data.pagination && data.pagination.totalProducts !== undefined
            ? data.pagination.totalProducts
            : productList.length;

        const pages =
          data.pagination && data.pagination.totalPages !== undefined
            ? data.pagination.totalPages
            : Math.ceil(total / productsPerPage) || 1;

        if (isMounted) {
          setProducts(productList);
          setTotalPages(pages);

          if (onTotalProductsChange) {
            onTotalProductsChange(total);
          }
        }
      } catch (err) {
        console.error("Products API Error:", err);
        if (isMounted) {
          setError(
            err.message || "Something went wrong while loading products."
          );
          setProducts([]);
          setTotalPages(1);

          if (onTotalProductsChange) {
            onTotalProductsChange(0);
          }
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
  }, [currentPage, sortBy, productsPerPage, category, searchTerm, onTotalProductsChange]);

  // =========================
  // SEARCH HANDLERS
  // =========================
  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  };

  const handleResetAllFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    if (setCategory) {
      setCategory("");
    }
    if (setSortBy) {
      setSortBy("default");
    }
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  };

  // =========================
  // PAGINATION HANDLERS
  // =========================
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
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const hasActiveFilters = Boolean(
    (searchTerm && searchTerm.trim()) ||
      category ||
      (sortBy && sortBy !== "default")
  );

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
            placeholder="Search products by name, description, sku..."
            value={searchInput}
            onChange={handleSearchChange}
          />

          {searchInput && (
            <button
              type="button"
              className="clear-search-button"
              onClick={handleClearSearch}
              title="Clear search"
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
          ACTIVE FILTERS & RESULTS BAR
      ========================= */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <span className="active-filters-label">Active:</span>

          {searchTerm && searchTerm.trim() && (
            <span className="active-filter-tag">
              Search: "{searchTerm.trim()}"
              <button
                type="button"
                onClick={handleClearSearch}
                title="Remove search"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {category && (
            <span className="active-filter-tag">
              Category: {category}
              <button
                type="button"
                onClick={() => {
                  setCategory("");
                  setCurrentPage(1);
                }}
                title="Remove category filter"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {sortBy && sortBy !== "default" && (
            <span className="active-filter-tag">
              Sort: {getSortLabel(sortBy)}
              <button
                type="button"
                onClick={() => {
                  setSortBy("default");
                  setCurrentPage(1);
                }}
                title="Reset sort"
              >
                <X size={13} />
              </button>
            </span>
          )}

          <button
            type="button"
            className="clear-all-tag-btn"
            onClick={handleResetAllFilters}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* =========================
          LOADING STATE
      ========================= */}
      {loading ? (
        <div className="products-loading-container">
          {Array.from({ length: Math.min(productsPerPage, 8) }).map((_, idx) => (
            <div className="product-skeleton-card" key={idx} />
          ))}
        </div>
      ) : error ? (
        /* =========================
            ERROR STATE
        ========================= */
        <div className="products-state-box error-box">
          <h2>Failed to load products</h2>
          <p>{error}</p>
          <button
            type="button"
            className="clear-all-search-button"
            onClick={() => handleResetAllFilters()}
          >
            <RotateCcw size={16} style={{ marginRight: "6px" }} />
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        /* =========================
            EMPTY STATE
        ========================= */
        <div className="products-state-box">
          <h2>No products found</h2>
          <p>
            {searchTerm.trim()
              ? `No products found matching "${searchTerm.trim()}"`
              : category
              ? `No products currently available in category "${category}"`
              : "No products available at the moment."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-all-search-button"
              onClick={handleResetAllFilters}
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        /* =========================
            PRODUCTS GRID OR LIST
        ========================= */
        <>
          <div
            className={`products-container ${
              viewMode === "list" ? "list-view" : ""
            }`}
            key={currentPage}
          >
            {products.map((product) => {
              const price = Number(product.price || 0);
              const discountPrice = Number(product.discountPrice || 0);
              const finalPrice = discountPrice > 0 ? discountPrice : price;

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
                        <img src={product.images[0]} alt={product.name} />
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
                          toast.success(`${product.name} added to cart!`);
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

                      <p className="product-category">{product.category}</p>

                      <div className="product-price">
                        <strong>
                          ₹ {finalPrice.toLocaleString("en-IN")}
                        </strong>

                        {discountPrice > 0 && discountPrice < price && (
                          <del>₹ {price.toLocaleString("en-IN")}</del>
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
                <button className="prev-btn" onClick={prevPage}>
                  Prev
                </button>
              )}

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}

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