import React from "react";
import "./Products3.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import image1 from "../../assets/Balcony.png";
import image2 from "../../assets/Laptop.png";
import image3 from "../../assets/Chair.png";
import image4 from "../../assets/Lamp.png";
import image5 from "../../assets/Kitchen.png";
import image6 from "../../assets/Decorate room.png";
import image7 from "../../assets/breakfast.png";
import image8 from "../../assets/Flowervase.png";

import {
  Share2,
  ArrowLeftRight,
  Heart,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

const Products3 = () => {

  // =========================================
  // CART FUNCTION
  // =========================================

  const { addToCart } = useCart();


  // =========================================
  // PRODUCTS
  // =========================================

  const products = [
    {
      id: 1,
      image: image1,
      name: "Syltherine",
      category: "Stylish cafe chair",
      price: "Rp 2.500.000",
      oldPrice: "Rp 3.500.000",
      badge: "-30%",
      badgeType: "discount",
    },

    {
      id: 2,
      image: image2,
      name: "Leviosa",
      category: "Stylish cafe chair",
      price: "Rp 2.500.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },

    {
      id: 3,
      image: image3,
      name: "Lolito",
      category: "Luxury big sofa",
      price: "Rp 7.000.000",
      oldPrice: "Rp 14.000.000",
      badge: "-50%",
      badgeType: "discount",
    },

    {
      id: 4,
      image: image4,
      name: "Respira",
      category: "Outdoor bar table and stool",
      price: "Rp 500.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },

    {
      id: 5,
      image: image5,
      name: "Grifo",
      category: "Night lamp",
      price: "Rp 1.500.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },

    {
      id: 6,
      image: image6,
      name: "Muggo",
      category: "Small mug",
      price: "Rp 150.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },

    {
      id: 7,
      image: image7,
      name: "Pingky",
      category: "Cute bed set",
      price: "Rp 7.000.000",
      oldPrice: "Rp 14.000.000",
      badge: "-50%",
      badgeType: "discount",
    },

    {
      id: 8,
      image: image8,
      name: "Potty",
      category: "Minimalist flower pot",
      price: "Rp 500.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
  ];


  // =========================================
  // ADD TO CART
  // =========================================

const handleAddToCart = (product) => {
  addToCart(product);

  toast.success(`${product.name} added to cart!`);
};

  // =========================================
  // JSX
  // =========================================

  return (

    <section className="products-section">

      <h2 className="products-title">
        Our Products
      </h2>


      <div className="products-container">

        {products.map((product) => (

          <div
            className="product-card"
            key={product.id}
          >

            {/* =================================
                PRODUCT IMAGE
            ================================= */}

            <div className="product-image">

              <img
                src={product.image}
                alt={product.name}
              />


              {/* BADGE */}

              {product.badge && (

                <span
                  className={`product-badge ${product.badgeType}`}
                >
                  {product.badge}
                </span>

              )}


              {/* =================================
                  PRODUCT OVERLAY
              ================================= */}

              <div className="product-overlay">


                {/* ADD TO CART */}

                <button
                  type="button"
                  className="cart-button"
                  onClick={() =>
                    handleAddToCart(product)
                  }
                >
                  Add to cart
                </button>


                {/* =================================
                    PRODUCT ACTIONS
                ================================= */}

                <div className="product-actions">


                  {/* SHARE */}

                  <button
                    type="button"
                    className="action-btn"
                  >

                    <Share2 size={16} />

                    <span>
                      Share
                    </span>

                  </button>


                  {/* COMPARE */}

                  <button
                    type="button"
                    className="action-btn"
                  >

                    <ArrowLeftRight size={16} />

                    <span>
                      Compare
                    </span>

                  </button>


                  {/* LIKE */}

                  <button
                    type="button"
                    className="action-btn"
                  >

                    <Heart size={16} />

                    <span>
                      Like
                    </span>

                  </button>

                </div>

              </div>

            </div>


            {/* =================================
                PRODUCT INFO
            ================================= */}

            <div className="product-info">

              <h3>
                {product.name}
              </h3>

              <p className="product-category">
                {product.category}
              </p>


              <div className="product-price">

                <strong>
                  {product.price}
                </strong>

                {product.oldPrice && (

                  <del>
                    {product.oldPrice}
                  </del>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* =================================
          SHOW MORE
      ================================= */}

      <Link
        to="/shop"
        className="show-more"
      >
        Show More
      </Link>

    </section>
  );
};

export default Products3;