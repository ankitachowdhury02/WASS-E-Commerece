import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import "./SingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://ecomm-qy13.onrender.com/api/products/${id}`
        );

        const data = await response.json();

        console.log("Single Product API Response:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load product"
          );
        }

        setProduct(data);

      } catch (error) {
        console.error("Single Product Error:", error);

        setError(
          error.message || "Something went wrong"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [id]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="single-product-loading">
        <div className="loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

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

  /* ---------------- NO PRODUCT ---------------- */

  if (!product) {
    return (
      <div className="single-product-error">
        <h2>Product not available</h2>
      </div>
    );
  }

  /* ---------------- PRICE ---------------- */

  const price = Number(product.price || 0);

  const discountPrice = Number(
    product.discountPrice || 0
  );

  const finalPrice =
    discountPrice > 0
      ? discountPrice
      : price;

  const hasDiscount =
    discountPrice > 0 &&
    discountPrice < price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((price - discountPrice) / price) * 100
      )
    : 0;

  /* ---------------- ADD TO CART ---------------- */

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,

      image:
        product.images?.length > 0
          ? product.images[0]
          : "",

      price: `₹ ${finalPrice}`,

      oldPrice: hasDiscount
        ? `₹ ${price}`
        : "",
    };

    addToCart(cartProduct);

    toast.success(
      `${product.name} added to cart!`
    );
  };

  return (
    <section className="single-product-page">

      <div className="single-product-container">

        {/* BREADCRUMB */}

        <div className="product-breadcrumb">

          <Link to="/shop">
            Shop
          </Link>

          <span>/</span>

          <span>{product.name}</span>

        </div>

        {/* PRODUCT MAIN AREA */}

        <div className="single-product-main">

          {/* LEFT IMAGE */}

          <div className="single-product-image-box">

            {product.images &&
            product.images.length > 0 ? (

              <img
                src={product.images[0]}
                alt={product.name}
                className="single-product-image"
              />

            ) : (

              <div className="no-product-image">
                <span>Image unavailable</span>
              </div>

            )}

          </div>

          {/* RIGHT DETAILS */}

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
                ₹ {finalPrice.toLocaleString("en-IN")}
              </strong>

              {hasDiscount && (
                <del>
                  ₹ {price.toLocaleString("en-IN")}
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
                {product.description
                  ? product.description
                  : "No description available for this product."}
              </p>

            </div>

            {/* PRODUCT INFORMATION */}

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

            {/* SIZES */}

            {product.sizes &&
              product.sizes.length > 0 && (

                <div className="product-option">

                  <h3>
                    Size
                  </h3>

                  <div className="option-list">

                    {product.sizes.map(
                      (size, index) => (

                        <span
                          key={index}
                          className="option-item"
                        >
                          {size}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}

            {/* COLORS */}

            {product.colors &&
              product.colors.length > 0 && (

                <div className="product-option">

                  <h3>
                    Color
                  </h3>

                  <div className="option-list">

                    {product.colors.map(
                      (color, index) => (

                        <span
                          key={index}
                          className="option-item"
                        >
                          {color}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}

            {/* ADD TO CART */}

            <button
              className="single-add-cart-button"
              onClick={handleAddToCart}
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

          </div>

        </div>

        {/* DESCRIPTION FULL SECTION */}

        <div className="full-description">

          <h2>
            Product Description
          </h2>

          <div className="description-line"></div>

          <p>
            {product.description
              ? product.description
              : "No description available for this product."}
          </p>

        </div>

        {/* BACK TO SHOP */}

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