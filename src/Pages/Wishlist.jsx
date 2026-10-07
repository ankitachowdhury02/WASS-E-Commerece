import React from "react";

import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
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


// =====================================================
// WISHLIST PAGE
// =====================================================

const Wishlist = () => {
  const navigate = useNavigate();


  // =====================================================
  // WISHLIST CONTEXT
  // =====================================================

  const {
    wishlistItems,
    wishlistLoading,
    removeFromWishlist,
  } = useWishlist();


  // =====================================================
  // CART CONTEXT
  // =====================================================

  const {
    addToCart,
  } = useCart();


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
  // GET PRODUCT IMAGE
  // =====================================================

  const getProductImage = (item) => {
    const product = getProduct(item);


    // -----------------------------------------------
    // IMAGES ARRAY
    // -----------------------------------------------

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


    // -----------------------------------------------
    // SINGLE IMAGE
    // -----------------------------------------------

    return (
      product?.image ||
      product?.imageUrl ||
      item?.image ||
      ""
    );
  };


  // =====================================================
  // GET PRODUCT PRICE
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


    const cartProduct = {
      id: productId,

      name:
        getProductName(item),

      image:
        getProductImage(item),

      price:
        getProductPrice(item),

      category:
        product?.category ||
        item?.category ||
        "",
    };


    await addToCart(
      cartProduct
    );
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (wishlistLoading) {
    return (
      <div className="wishlist-page">

        <div className="wishlist-container">

          <div className="wishlist-loading">

            <Heart
              size={45}
              strokeWidth={1.5}
            />

            <h2>
              Loading Wishlist...
            </h2>

            <p>
              Please wait while we load
              your saved products.
            </p>

          </div>

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

        <div className="wishlist-container">

          {/* HEADER */}

          <div className="wishlist-header">

            <div>

              <span className="wishlist-subtitle">
                YOUR COLLECTION
              </span>

              <h1>
                My Wishlist
              </h1>

            </div>


            <Heart
              size={42}
              strokeWidth={1.5}
            />

          </div>


          {/* EMPTY CONTENT */}

          <div className="wishlist-empty">

            <div className="wishlist-empty-icon">

              <Heart
                size={42}
                strokeWidth={1.5}
              />

            </div>


            <h2>
              Your wishlist is empty
            </h2>


            <p>
              Save products you love and
              come back to them anytime.
            </p>


            <Link
              to="/shop"
              className="wishlist-shop-button"
            >

              <ShoppingCart
                size={18}
              />

              Continue Shopping

            </Link>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // WISHLIST PAGE WITH PRODUCTS
  // =====================================================

  return (
    <div className="wishlist-page">

      <div className="wishlist-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="wishlist-header">

          <div>

            <span className="wishlist-subtitle">
              YOUR COLLECTION
            </span>

            <h1>
              My Wishlist
            </h1>

          </div>


          <Heart
            size={42}
            strokeWidth={1.5}
          />

        </div>


        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        <div className="wishlist-grid">

          {wishlistItems.map(
            (item, index) => {

              const productId =
                getProductId(item);

              const productName =
                getProductName(item);

              const productImage =
                getProductImage(item);

              const productPrice =
                getProductPrice(item);


              return (
                <div
                  className="wishlist-card"
                  key={
                    productId ||
                    item?.id ||
                    index
                  }
                >

                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================= */}

                  <div className="wishlist-card-image">

                    {productImage ? (

                      <img
                        src={productImage}
                        alt={productName}
                      />

                    ) : (

                      <div className="wishlist-no-image">

                        <Heart
                          size={35}
                          strokeWidth={1.5}
                        />

                      </div>

                    )}

                  </div>


                  {/* =================================================
                      PRODUCT INFORMATION
                  ================================================= */}

                  <div className="wishlist-card-content">

                    <h3>
                      {productName}
                    </h3>


                    <p className="wishlist-price">

                      ₹{" "}
                      {productPrice.toLocaleString(
                        "en-IN"
                      )}

                    </p>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="wishlist-actions">

                      {/* ADD TO CART */}

                      <button
                        type="button"
                        className="wishlist-cart-button"
                        onClick={() =>
                          handleAddToCart(
                            item
                          )
                        }
                      >

                        <ShoppingCart
                          size={17}
                        />

                        <span>
                          Add to Cart
                        </span>

                      </button>


                      {/* REMOVE PRODUCT */}

                      <button
                        type="button"
                        className="wishlist-remove-button"
                        onClick={() =>
                          handleRemove(
                            item
                          )
                        }
                      >

                        <Trash2
                          size={17}
                        />

                        <span>
                          Remove
                        </span>

                      </button>

                    </div>


                    {/* =================================================
                        VIEW PRODUCT
                    ================================================= */}

                    {productId && (

                      <button
                        type="button"
                        className="wishlist-view-button"
                        onClick={() =>
                          navigate(
                            `/product/${productId}`
                          )
                        }
                      >
                        View Product
                      </button>

                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>


        {/* =================================================
            BACK TO SHOP
        ================================================= */}

        <div className="wishlist-back">

          <Link to="/shop">

            <ArrowLeft
              size={18}
            />

            Continue Shopping

          </Link>

        </div>

      </div>

    </div>
  );
};


export default Wishlist;