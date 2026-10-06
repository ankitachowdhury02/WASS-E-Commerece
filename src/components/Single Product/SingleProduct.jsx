import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getFallbackProductById } from "../../data/fallbackProducts";

import "./SingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSingleProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://ecomm-qy13.onrender.com/api/products/${id}`
        );

        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setProduct(data);
            setSelectedSize(
              data.sizes && data.sizes.length > 0 ? data.sizes[0] : ""
            );
            setSelectedColor(
              data.colors && data.colors.length > 0 ? data.colors[0] : ""
            );
            setSelectedImage(0);
            setAddedToCart(false);
          }
          return;
        }

        // If not found in API, check local fallback product catalog
        const fallback = getFallbackProductById(id);
        if (fallback) {
          if (isMounted) {
            setProduct(fallback);
            setSelectedSize(
              fallback.sizes && fallback.sizes.length > 0
                ? fallback.sizes[0]
                : ""
            );
            setSelectedColor(
              fallback.colors && fallback.colors.length > 0
                ? fallback.colors[0]
                : ""
            );
            setSelectedImage(0);
            setAddedToCart(false);
          }
          return;
        }

        throw new Error("Failed to load product");
      } catch (err) {
        console.error("Single Product Error:", err);

        // Check fallback in case of network issue
        const fallback = getFallbackProductById(id);
        if (fallback && isMounted) {
          setProduct(fallback);
          setSelectedSize(
            fallback.sizes && fallback.sizes.length > 0 ? fallback.sizes[0] : ""
          );
          setSelectedColor(
            fallback.colors && fallback.colors.length > 0 ? fallback.colors[0] : ""
          );
          setSelectedImage(0);
          setAddedToCart(false);
          return;
        }

        if (isMounted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSingleProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="single-product-loading">
        <div className="loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="single-product-error">
        <h2>Product Not Found</h2>
        <p>{error}</p>

        <Link to="/shop">
          <button className="back-shop-button">
            Back to Shop
          </button>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="single-product-error">
        <h2>Product not available</h2>
      </div>
    );
  }

  /* =========================
     PRICE
  ========================= */

  const rawPrice =
    typeof product.price === "number"
      ? product.price
      : parseFloat(String(product.price || 0).replace(/[^0-9.]/g, "")) || 0;

  const rawDiscountPrice =
    product.discountPrice !== undefined &&
    product.discountPrice !== null &&
    product.discountPrice !== ""
      ? typeof product.discountPrice === "number"
        ? product.discountPrice
        : parseFloat(String(product.discountPrice).replace(/[^0-9.]/g, "")) || 0
      : 0;

  const rawOldPrice = product.oldPrice
    ? typeof product.oldPrice === "number"
      ? product.oldPrice
      : parseFloat(String(product.oldPrice).replace(/[^0-9.]/g, "")) || 0
    : 0;

  let finalPrice = rawPrice;
  let price = rawOldPrice || rawPrice;
  let hasDiscount = false;
  let discountPercentage = 0;

  if (rawDiscountPrice > 0 && rawDiscountPrice < rawPrice) {
    finalPrice = rawDiscountPrice;
    price = rawPrice;
    hasDiscount = true;
    discountPercentage = Math.round(
      ((rawPrice - rawDiscountPrice) / rawPrice) * 100
    );
  } else if (rawOldPrice > 0 && rawPrice < rawOldPrice) {
    finalPrice = rawPrice;
    price = rawOldPrice;
    hasDiscount = true;
    discountPercentage = Math.round(
      ((rawOldPrice - rawPrice) / rawOldPrice) * 100
    );
  }

  /* =========================
     IMAGES
  ========================= */

  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const currentImage =
    productImages.length > 0
      ? productImages[selectedImage]
      : "";

  /* =========================
     PREVIOUS IMAGE
  ========================= */

  const handlePreviousImage = () => {
    if (productImages.length <= 1) return;

    setSelectedImage((previous) =>
      previous === 0
        ? productImages.length - 1
        : previous - 1
    );
  };

  /* =========================
     NEXT IMAGE
  ========================= */

  const handleNextImage = () => {
    if (productImages.length <= 1) return;

    setSelectedImage((previous) =>
      previous === productImages.length - 1
        ? 0
        : previous + 1
    );
  };

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = async () => {
    if (
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      toast.error("Please select a size");
      return;
    }

    if (
      product.colors &&
      product.colors.length > 0 &&
      !selectedColor
    ) {
      toast.error("Please select a color");
      return;
    }

    const cartProduct = {
      ...product,

      image:
        currentImage ||
        (productImages.length > 0
          ? productImages[0]
          : ""),

      price: `₹ ${finalPrice}`,

      oldPrice: hasDiscount
        ? `₹ ${price}`
        : "",

      selectedSize: selectedSize,
      selectedColor: selectedColor,
    };

    const success = await addToCart(cartProduct);

    if (success) {
      setAddedToCart(true);

      toast.success(
        `${product.name} added to cart!`
      );
    }
  };

  /* =========================
     GO TO CART
  ========================= */

  const handleGoToCart = () => {
    navigate("/cart");
  };

  return (
    <section className="single-product-page">

      <div className="single-product-container">

        {/* =========================
            BREADCRUMB
        ========================= */}

        <div className="product-breadcrumb">

          <Link to="/shop">
            Shop
          </Link>

          <span>/</span>

          <span>
            {product.name}
          </span>

        </div>

        {/* =========================
            MAIN PRODUCT AREA
        ========================= */}

        <div className="single-product-main">

          {/* =========================
              PRODUCT IMAGES
          ========================= */}

          <div className="single-product-gallery">

            {/* MAIN IMAGE */}

            <div className="single-product-image-box">

              {productImages.length > 0 ? (

                <>
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="single-product-image"
                  />

                  {/* PREVIOUS */}

                  {productImages.length > 1 && (
                    <button
                      type="button"
                      className="image-arrow image-arrow-left"
                      onClick={
                        handlePreviousImage
                      }
                    >
                      <ChevronLeft
                        size={22}
                      />
                    </button>
                  )}

                  {/* NEXT */}

                  {productImages.length > 1 && (
                    <button
                      type="button"
                      className="image-arrow image-arrow-right"
                      onClick={
                        handleNextImage
                      }
                    >
                      <ChevronRight
                        size={22}
                      />
                    </button>
                  )}

                </>

              ) : (

                <div className="no-product-image">
                  <span>
                    Image unavailable
                  </span>
                </div>

              )}

            </div>

            {/* =========================
                ALL IMAGE THUMBNAILS
            ========================= */}

            {productImages.length > 1 && (

              <div className="product-thumbnail-container">

                {productImages.map(
                  (image, index) => (

                    <button
                      type="button"
                      key={index}
                      className={`product-thumbnail ${
                        selectedImage === index
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                    >

                      <img
                        src={image}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>

          {/* =========================
              PRODUCT DETAILS
          ========================= */}

          <div className="single-product-details">

            {/* NAME */}

            <h1 className="single-product-title">
              {product.name}
            </h1>

            {/* CATEGORY */}

            <p className="single-product-category">
              {product.category}
            </p>

            {/* PRICE */}

            <div className="single-product-price">

              <strong>
                ₹{" "}
                {finalPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>

              {hasDiscount && (
                <del>
                  ₹{" "}
                  {price.toLocaleString(
                    "en-IN"
                  )}
                </del>
              )}

              {hasDiscount && (
                <span className="discount-badge">
                  -{discountPercentage}%
                </span>
              )}

            </div>

            {/* DESCRIPTION */}

            <div className="product-description-section">

              <h3>
                Description
              </h3>

              <p>
                {product.description ||
                  "No description available for this product."}
              </p>

            </div>

            {/* INFORMATION */}

            <div className="product-information">

              <div className="information-row">

                <span>
                  SKU
                </span>

                <strong>
                  {product.sku || "N/A"}
                </strong>

              </div>

              <div className="information-row">

                <span>
                  Stock
                </span>

                <strong>
                  {product.stock ?? "N/A"}
                </strong>

              </div>

            </div>

            {/* =========================
                SIZE
            ========================= */}

            {product.sizes &&
              product.sizes.length > 0 && (

                <div className="product-option">

                  <h3>
                    Size
                  </h3>

                  <div className="option-list">

                    {product.sizes.map(
                      (size, index) => (

                        <button
                          type="button"
                          key={index}
                          className={`option-item ${
                            selectedSize === size
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedSize(
                              size
                            )
                          }
                        >

                          {size}

                          {selectedSize ===
                            size && (
                            <Check
                              size={14}
                            />
                          )}

                        </button>

                      )
                    )}

                  </div>

                  {!selectedSize && (
                    <p className="selection-message">
                      Please select a size
                    </p>
                  )}

                </div>

              )}

            {/* =========================
                COLOR
            ========================= */}

            {product.colors &&
              product.colors.length > 0 && (

                <div className="product-option">

                  <h3>
                    Color
                  </h3>

                  <div className="option-list">

                    {product.colors.map(
                      (color, index) => (

                        <button
                          type="button"
                          key={index}
                          className={`option-item ${
                            selectedColor === color
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedColor(
                              color
                            )
                          }
                        >

                          {color}

                          {selectedColor ===
                            color && (
                            <Check
                              size={14}
                            />
                          )}

                        </button>

                      )
                    )}

                  </div>

                  {!selectedColor && (
                    <p className="selection-message">
                      Please select a color
                    </p>
                  )}

                </div>

              )}

            {/* =========================
                CART BUTTON
            ========================= */}

            {!addedToCart ? (

              <button
                className="single-add-cart-button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  product.stock === 0
                }
              >

                <ShoppingCart
                  size={20}
                />

                {product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}

              </button>

            ) : (

              <button
                className="single-go-cart-button"
                onClick={
                  handleGoToCart
                }
              >

                <ShoppingCart
                  size={20}
                />

                Go to Cart

              </button>

            )}

          </div>

        </div>

        {/* =========================
            FULL DESCRIPTION
        ========================= */}

        <div className="full-description">

          <h2>
            Product Description
          </h2>

          <div className="description-line"></div>

          <p>
            {product.description ||
              "No description available for this product."}
          </p>

        </div>

        {/* =========================
            BACK TO SHOP
        ========================= */}

        <div className="back-to-shop">

          <Link to="/shop">

            <ArrowLeft size={18} />

            Continue Shopping

          </Link>

        </div>

      </div>

    </section>
  );
};

export default SingleProduct;