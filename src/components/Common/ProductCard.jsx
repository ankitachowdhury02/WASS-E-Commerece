import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Share2,
  ArrowLeftRight,
  Heart,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const navigate = useNavigate();

  if (!product) return null;

  // ==========================================
  // PRICE
  // ==========================================

  const rawPrice =
    typeof product.price === "number"
      ? product.price
      : parseFloat(
          String(product.price || 0).replace(
            /[^0-9.]/g,
            ""
          )
        ) || 0;

  // ==========================================
  // DISCOUNT PRICE
  // ==========================================

  const rawDiscountPrice =
    product.discountPrice !== undefined &&
    product.discountPrice !== null &&
    product.discountPrice !== ""
      ? typeof product.discountPrice === "number"
        ? product.discountPrice
        : parseFloat(
            String(product.discountPrice).replace(
              /[^0-9.]/g,
              ""
            )
          ) || 0
      : 0;

  // ==========================================
  // OLD PRICE
  // ==========================================

  const rawOldPrice = product.oldPrice
    ? typeof product.oldPrice === "number"
      ? product.oldPrice
      : parseFloat(
          String(product.oldPrice).replace(
            /[^0-9.]/g,
            ""
          )
        ) || 0
    : 0;

  // ==========================================
  // FINAL PRICE CALCULATION
  // ==========================================

  let finalPrice = rawPrice;
  let originalPrice = rawOldPrice;
  let hasDiscount = false;
  let discountPercentage = 0;

  if (
    rawDiscountPrice > 0 &&
    rawDiscountPrice < rawPrice
  ) {
    finalPrice = rawDiscountPrice;
    originalPrice = rawPrice;

    hasDiscount = true;

    discountPercentage = Math.round(
      ((rawPrice - rawDiscountPrice) /
        rawPrice) *
        100
    );
  } else if (
    rawOldPrice > 0 &&
    rawPrice < rawOldPrice
  ) {
    finalPrice = rawPrice;
    originalPrice = rawOldPrice;

    hasDiscount = true;

    discountPercentage = Math.round(
      ((rawOldPrice - rawPrice) /
        rawOldPrice) *
        100
    );
  }

  // ==========================================
  // BADGE
  // ==========================================

  let badge = product.badge || "";
  let badgeType = product.badgeType || "";

  if (
    !badge &&
    hasDiscount &&
    discountPercentage > 0
  ) {
    badge = `-${discountPercentage}%`;
    badgeType = "discount";
  }

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const primaryImage =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images[0]
      : product.image || "";

  // ==========================================
  // CART PRODUCT
  // ==========================================

  const cartProduct = {
    ...product,

    image: primaryImage,

    price: `₹ ${finalPrice.toLocaleString(
      "en-IN"
    )}`,

    oldPrice:
      hasDiscount &&
      originalPrice > finalPrice
        ? `₹ ${originalPrice.toLocaleString(
            "en-IN"
          )}`
        : "",
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    await addToCart(cartProduct);
  };

  // ==========================================
  // WISHLIST
  // ==========================================

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = product.id;

    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    const alreadyInWishlist =
      isInWishlist(productId);

    if (alreadyInWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  // ==========================================
  // SHARE / COMPARE
  // ==========================================

  const handleActionClick = (
    e,
    actionType
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // SHARE
    if (actionType === "Share") {
      const shareUrl =
        `${window.location.origin}/product/${product.id}`;

      if (navigator.share) {
        navigator
          .share({
            title: product.name,
            url: shareUrl,
          })
          .catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            toast.info(
              "Product link copied to clipboard!"
            );
          })
          .catch(() => {
            toast.info(
              `Sharing: ${product.name}`
            );
          });
      } else {
        toast.info(
          `Sharing: ${product.name}`
        );
      }
    }

    // COMPARE
    else if (actionType === "Compare") {
      toast.info(
        `Added ${product.name} to comparison!`
      );
    }
  };

  // ==========================================
  // CARD CLICK
  // ==========================================

  const handleCardClick = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest(".action-btn")
    ) {
      return;
    }

    navigate(
      `/product/${product.id}`
    );
  };

  // ==========================================
  // WISHLIST STATUS
  // ==========================================

  const wishlistActive =
    isInWishlist(product.id);

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div
      className="product-card"
      key={product.id}
      onClick={handleCardClick}
      style={{
        cursor: "pointer",
      }}
    >
      {/* ==========================================
          IMAGE CONTAINER
      ========================================== */}

      <div className="product-image">

        <Link
          to={`/product/${product.id}`}
          onClick={(e) =>
            e.stopPropagation()
          }
          aria-label={`View details of ${product.name}`}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
          }}
        >
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
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

        {/* ==========================================
            BADGE
        ========================================== */}

        {badge && (
          <span
            className={`product-badge ${badgeType}`}
          >
            {badge}
          </span>
        )}

        {/* ==========================================
            HOVER / TOUCH OVERLAY
        ========================================== */}

        <div className="product-overlay">

          {/* ==========================================
              ADD TO CART
          ========================================== */}

          <button
            type="button"
            className="cart-button"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div className="product-actions">

            {/* SHARE */}

            <button
              className="action-btn"
              type="button"
              onClick={(e) =>
                handleActionClick(
                  e,
                  "Share"
                )
              }
              title="Share product"
            >
              <Share2 size={14} />

              <span>
                Share
              </span>
            </button>

            {/* COMPARE */}

            <button
              className="action-btn"
              type="button"
              onClick={(e) =>
                handleActionClick(
                  e,
                  "Compare"
                )
              }
              title="Compare product"
            >
              <ArrowLeftRight size={14} />

              <span>
                Compare
              </span>
            </button>

            {/* WISHLIST */}

            <button
              className={`action-btn ${
                wishlistActive
                  ? "wishlist-active"
                  : ""
              }`}
              type="button"
              onClick={handleWishlist}
              title={
                wishlistActive
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              aria-label={
                wishlistActive
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <Heart
                size={14}
                fill={
                  wishlistActive
                    ? "currentColor"
                    : "none"
              }
              />

              <span>
                {wishlistActive
                  ? "Liked"
                  : "Like"}
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* ==========================================
          PRODUCT INFO
      ========================================== */}

      <Link
        to={`/product/${product.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        aria-label={`View details of ${product.name}`}
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

            {hasDiscount &&
              originalPrice >
                finalPrice && (
                <del>
                  ₹{" "}
                  {originalPrice.toLocaleString(
                    "en-IN"
                  )}
                </del>
              )}

          </div>

        </div>
      </Link>
    </div>
  );
};

export default ProductCard;