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

import { Share2, ArrowLeftRight, Heart } from "lucide-react";

import { useCart } from "../../context/CartContext";

const Products3 = () => {
  const { addToCart } = useCart();

  const products = [
    {
      id: 1,
      image: image1,
      name: "Syltherine Sheesham Chair",
      category: "Handcrafted Teak Dining Chair",
      price: "₹ 2,499",
      oldPrice: "₹ 3,499",
      badge: "-30%",
      badgeType: "discount",
    },

    {
      id: 2,
      image: image2,
      name: "Leviosa Ergonomic Study Chair",
      category: "Ergonomic Office Chair",
      price: "₹ 2,799",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },

    {
      id: 3,
      image: image3,
      name: "Lolito Royal Velvet 3-Seater Sofa",
      category: "Luxury Living Room Sofa",
      price: "₹ 24,999",
      oldPrice: "₹ 49,999",
      badge: "-50%",
      badgeType: "discount",
    },

    {
      id: 4,
      image: image4,
      name: "Respira Teak Outdoor Bar Stool",
      category: "Solid Wood Bar Stool",
      price: "₹ 4,499",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },

    {
      id: 5,
      image: image5,
      name: "Grifo Antique Brass Table Lamp",
      category: "Warm Bedside Night Lamp",
      price: "₹ 1,499",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },

    {
      id: 6,
      image: image6,
      name: "Muggo Jaipur Handcrafted Mug",
      category: "Studio Ceramic Coffee Mug",
      price: "₹ 399",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },

    {
      id: 7,
      image: image7,
      name: "Pingky Luxury Cotton King Bedding",
      category: "Pure Cotton 300TC Bed Set",
      price: "₹ 4,999",
      oldPrice: "₹ 9,999",
      badge: "-50%",
      badgeType: "discount",
    },

    {
      id: 8,
      image: image8,
      name: "Potty Khurja Ceramic Planter",
      category: "Handcrafted Ceramic Planter",
      price: "₹ 699",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
  ];

  const handleAddToCart = (product) => {
    addToCart(product);

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="products-section">
      <h2 className="products-title">Our Products</h2>

      <div className="products-container">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />

              {/* BADGE */}

              {product.badge && (
                <span className={`product-badge ${product.badgeType}`}>
                  {product.badge}
                </span>
              )}

              <div className="product-overlay">
                {/* ADD TO CART */}

                <button
                  type="button"
                  className="cart-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to cart
                </button>

                <div className="product-actions">
                  {/* SHARE */}

                  <button type="button" className="action-btn">
                    <Share2 size={16} />

                    <span>Share</span>
                  </button>

                  {/* COMPARE */}

                  <button type="button" className="action-btn">
                    <ArrowLeftRight size={16} />

                    <span>Compare</span>
                  </button>

                  {/* LIKE */}

                  <button type="button" className="action-btn">
                    <Heart size={16} />

                    <span>Like</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>

              <p className="product-category">{product.category}</p>

              <div className="product-price">
                <strong>{product.price}</strong>

                {product.oldPrice && <del>{product.oldPrice}</del>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/shop" className="show-more">
        Show More
      </Link>
    </section>
  );
};

export default Products3;
