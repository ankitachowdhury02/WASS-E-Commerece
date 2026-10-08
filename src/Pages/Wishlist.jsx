import React, { useState, useEffect } from "react";

import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Eye,
  Check,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import {
  useWishlist,
} from "../context/WishlistContext";

import {
  useCart,
} from "../context/CartContext";

import "./Wishlist.css";


const Wishlist = () => {
  const navigate = useNavigate();

  // State for popup message when item added to cart
  const [cartPopup, setCartPopup] = useState(null);

  // State to track recently added products so button changes immediately
  const [addedProductIds, setAddedProductIds] = useState([]);

  // Auto-dismiss popup message after 5 seconds
  useEffect(() => {
    if (cartPopup) {
      const timer = setTimeout(() => {
        setCartPopup(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [cartPopup]);


  // =====================================================
  // WISHLIST
  // =====================================================

  const {
    wishlistItems,
    wishlistLoading,
    removeFromWishlist,
  } = useWishlist();


  // =====================================================
  // CART
  // =====================================================

  const {
    cartItems,
    addToCart,
  } = useCart();


  // =====================================================
  // CHECK IF PRODUCT IS IN CART
  // =====================================================

  const isItemInCart = (item) => {
    const productId = getProductId(item);
    if (!productId) return false;

    // 1. Check if added during this session
    if (addedProductIds.includes(String(productId))) {
      return true;
    }

    // 2. Check if already present in cartItems from CartContext
    if (Array.isArray(cartItems)) {
      return cartItems.some((cartItem) => {
        const cId =
          cartItem?.productId ||
          cartItem?.id ||
          cartItem?._id ||
          cartItem?.product?.id ||
          cartItem?.product?._id;
        return String(cId) === String(productId);
      });
    }

    return false;
  };


  // =====================================================
  // GET PRODUCT
  // =====================================================

  const getProduct = (item) => {
    if (!item) {
      return null;
    }

    return (
      item.product ||
      item.productDetails ||
      item.productData ||
      item
    );
  };


  // =====================================================
  // GET PRODUCT ID
  // =====================================================

  const getProductId = (item) => {
    const product = getProduct(item);

    return (
      item?.productId ||
      item?.product_id ||
      product?.id ||
      product?._id ||
      product?.productId ||
      item?.id ||
      item?._id ||
      null
    );
  };


  // =====================================================
  // GET PRODUCT NAME
  // =====================================================

  const getProductName = (item) => {
    const product = getProduct(item);

    return (
      product?.name ||
      product?.title ||
      item?.name ||
      item?.title ||
      "Product"
    );
  };


  // =====================================================
  // GET CATEGORY
  // =====================================================

  const getProductCategory = (item) => {
    const product = getProduct(item);

    return (
      product?.category ||
      item?.category ||
      "Furniture"
    );
  };


  // =====================================================
  // GET IMAGE
  // =====================================================

  const getProductImage = (item) => {
    const product = getProduct(item);


    if (
      Array.isArray(product?.images) &&
      product.images.length > 0
    ) {
      const image = product.images[0];


      if (typeof image === "string") {
        return image;
      }


      if (image?.url) {
        return image.url;
      }


      if (image?.src) {
        return image.src;
      }
    }


    return (
      product?.image ||
      product?.imageUrl ||
      item?.image ||
      ""
    );
  };


  // =====================================================
  // GET CURRENT PRICE
  // =====================================================

  const getProductPrice = (item) => {
    const product = getProduct(item);

    const price =
      product?.discountPrice ??
      product?.price ??
      item?.discountPrice ??
      item?.price ??
      0;


    return (
      parseFloat(
        String(price).replace(
          /[^0-9.]/g,
          ""
        )
      ) || 0
    );
  };


  // =====================================================
  // GET OLD PRICE
  // =====================================================

  const getOldPrice = (item) => {
    const product = getProduct(item);

    const oldPrice =
      product?.oldPrice ??
      product?.originalPrice ??
      product?.mrp ??
      item?.oldPrice ??
      item?.originalPrice ??
      item?.mrp ??
      0;


    return (
      parseFloat(
        String(oldPrice).replace(
          /[^0-9.]/g,
          ""
        )
      ) || 0
    );
  };


  // =====================================================
  // GET DISCOUNT
  // =====================================================

  const getDiscount = (item) => {
    const product = getProduct(item);

    const discount =
      product?.discount ??
      product?.discountPercentage ??
      item?.discount ??
      item?.discountPercentage;


    if (
      discount !== undefined &&
      discount !== null &&
      discount !== ""
    ) {
      const value = parseFloat(
        String(discount).replace(
          /[^0-9.]/g,
          ""
        )
      );

      if (!isNaN(value) && value > 0) {
        return Math.round(value);
      }
    }


    const price =
      getProductPrice(item);

    const oldPrice =
      getOldPrice(item);


    if (
      oldPrice > price &&
      price > 0
    ) {
      return Math.round(
        ((oldPrice - price) /
          oldPrice) *
          100
      );
    }


    return 0;
  };


  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const handleRemove = async (item) => {
    const productId =
      getProductId(item);


    if (!productId) {
      toast.error(
        "Product ID not found"
      );

      return;
    }


    await removeFromWishlist(
      productId
    );
  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (item) => {
    const product =
      getProduct(item);

    const productId =
      getProductId(item);


    if (!productId) {
      toast.error(
        "Product ID not found"
      );

      return;
    }

    // Immediately mark as added so button instantly updates to "Item in Cart"
    setAddedProductIds((prev) => [...prev, String(productId)]);

    const cartProduct = {
      id: productId,

      name:
        getProductName(item),

      image:
        getProductImage(item),

      price:
        getProductPrice(item),

      category:
        getProductCategory(item),
    };


    await addToCart(
      cartProduct
    );

    // Show popup message: click to go directly to cart
    setCartPopup({
      name: cartProduct.name,
      image: cartProduct.image,
    });
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (wishlistLoading) {
    return (
      <div className="wishlist-page">

        <div className="wishlist-loading">

          <div className="wishlist-loading-icon">
            <Heart
              size={32}
              strokeWidth={1.5}
            />
          </div>

          <h2>
            Loading your wishlist
          </h2>

          <p>
            Please wait a moment.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // EMPTY WISHLIST
  // =====================================================

  if (
    !wishlistItems ||
    wishlistItems.length === 0
  ) {
    return (
      <div className="wishlist-page">

        <div className="wishlist-empty">

          <div className="wishlist-empty-symbol">

            <Heart
              size={40}
              strokeWidth={1.3}
            />

          </div>


          <span className="wishlist-eyebrow">
            YOUR COLLECTION
          </span>


          <h1>
            My Wishlist
          </h1>


          <p>
            Your favourite pieces will
            appear here.
          </p>


          <Link
            to="/shop"
            className="wishlist-empty-button"
          >
            <ShoppingCart size={17} />

            Explore Products
          </Link>

        </div>

      </div>
    );
  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="wishlist-page">

      {/* =================================================
          POPUP MESSAGE: ITEM ADDED TO CART -> GO TO CART
      ================================================= */}
      {cartPopup && (
        <div
          className="wishlist-cart-popup"
          onClick={() => navigate("/cart")}
          title="Click to go to Cart"
        >
          <div className="wishlist-cart-popup-left">
            {cartPopup.image ? (
              <img
                src={cartPopup.image}
                alt={cartPopup.name}
                className="wishlist-cart-popup-img"
              />
            ) : (
              <div className="wishlist-cart-popup-icon">
                <ShoppingCart size={20} />
              </div>
            )}

            <div className="wishlist-cart-popup-info">
              <span className="wishlist-cart-popup-badge">
                <Check size={14} /> Added to Cart
              </span>
              <p className="wishlist-cart-popup-name">
                {cartPopup.name}
              </p>
              <span className="wishlist-cart-popup-cta">
                Click here to go to Cart &rarr;
              </span>
            </div>
          </div>

          <div className="wishlist-cart-popup-actions">
            <button
              type="button"
              className="wishlist-cart-popup-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/cart");
              }}
            >
              Go to Cart
            </button>

            <button
              type="button"
              className="wishlist-cart-popup-close"
              onClick={(e) => {
                e.stopPropagation();
                setCartPopup(null);
              }}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="wishlist-container">


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="wishlist-page-header">

          <div className="wishlist-heading">

            <span className="wishlist-eyebrow">
              YOUR COLLECTION
            </span>

            <h1>
              My Wishlist
            </h1>

            <p>
              Pieces you've saved for later.
            </p>

          </div>


          <div className="wishlist-count">

            <Heart
              size={20}
              strokeWidth={1.5}
            />

            <span>
              {wishlistItems.length}
            </span>

            <small>
              {wishlistItems.length === 1
                ? "Item Saved"
                : "Items Saved"}
            </small>

          </div>

        </section>


        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        <section className="wishlist-grid">

          {wishlistItems.map(
            (item, index) => {

              const productId =
                getProductId(item);

              const productName =
                getProductName(item);

              const category =
                getProductCategory(item);

              const image =
                getProductImage(item);

              const price =
                getProductPrice(item);

              const oldPrice =
                getOldPrice(item);

              const discount =
                getDiscount(item);

              const inCart =
                isItemInCart(item);

              return (
                <article
                  className="wishlist-card"
                  key={
                    productId ||
                    item?.id ||
                    index
                  }
                >


                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="wishlist-image-wrapper">


                    {image ? (

                      <img
                        src={image}
                        alt={productName}
                        className="wishlist-product-image"
                      />

                    ) : (

                      <div className="wishlist-image-placeholder">

                        <Heart
                          size={38}
                          strokeWidth={1.2}
                        />

                      </div>

                    )}


                    {/* DISCOUNT */}

                    {discount > 0 && (

                      <span className="wishlist-discount">

                        -{discount}%

                      </span>

                    )}


                    {/* WISHLIST ICON */}

                    <button
                      type="button"
                      className="wishlist-heart-button"
                      onClick={() =>
                        handleRemove(item)
                      }
                      title="Remove from wishlist"
                    >

                      <Heart
                        size={18}
                        fill="currentColor"
                      />

                    </button>


                    {/* HOVER VIEW */}

                    {productId && (

                      <button
                        type="button"
                        className="wishlist-image-view"
                        onClick={() =>
                          navigate(
                            `/product/${productId}`
                          )
                        }
                      >

                        <Eye size={16} />

                        View Product

                      </button>

                    )}

                  </div>


                  {/* =================================================
                      PRODUCT DETAILS
                  ================================================= */}

                  <div className="wishlist-product-info">


                    <span className="wishlist-category">
                      {category}
                    </span>


                    <h2>
                      {productName}
                    </h2>


                    <div className="wishlist-price-row">

                      <strong>
                        ₹{" "}
                        {price.toLocaleString(
                          "en-IN"
                        )}
                      </strong>


                      {oldPrice > price && (

                        <del>
                          ₹{" "}
                          {oldPrice.toLocaleString(
                            "en-IN"
                          )}
                        </del>

                      )}

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="wishlist-card-actions">


                      {/* ADD TO CART / ITEM IN CART */}

                      <button
                        type="button"
                        className={`wishlist-add-cart ${
                          inCart ? "in-cart" : ""
                        }`}
                        onClick={() => {
                          if (inCart) {
                            navigate("/cart");
                          } else {
                            handleAddToCart(item);
                          }
                        }}
                      >

                        {inCart ? (
                          <>
                            <Check
                              size={16}
                            />

                            <span>
                              Item in Cart
                            </span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart
                              size={16}
                            />

                            <span>
                              Add to Cart
                            </span>
                          </>
                        )}

                      </button>

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </section>


        {/* =================================================
            FOOTER ACTION
        ================================================= */}

        <div className="wishlist-footer">

          <Link
            to="/shop"
            className="wishlist-back-shop"
          >

            <ArrowLeft
              size={17}
            />

            Continue Shopping

          </Link>

        </div>

      </div>

    </div>
  );
};


export default Wishlist;