import React from "react";
import "./Products3.css";
import { Link } from "react-router-dom";

import image1 from "../../assets/Balcony.png";
import image2 from "../../assets/Laptop.png";
import image3 from "../../assets/Chair.png";
import image4 from "../../assets/Lamp.png";
import image5 from "../../assets/Kitchen.png";
import image6 from "../../assets/Decorate room.png";
import image7 from "../../assets/breakfast.png";
import image8 from "../../assets/Flowervase.png";

import { Share2, ArrowLeftRight, Heart } from "lucide-react";

const Products3 = () => {

  const products = [
    {
      image: image1,
      name: "Syltherine",
      category: "Stylish cafe chair",
      price: "Rp 2.500.000",
      oldPrice: "Rp 3.500.000",
      badge: "-30%",
      badgeType: "discount"
    },

    {
      image: image2,
      name: "Leviosa",
      category: "Stylish cafe chair",
      price: "Rp 2.500.000",
      oldPrice: "",
      badge: "",
      badgeType: ""
    },

    {
      image: image3,
      name: "Lolito",
      category: "Luxury big sofa",
      price: "Rp 7.000.000",
      oldPrice: "Rp 14.000.000",
      badge: "-50%",
      badgeType: "discount"
    },

    {
      image: image4,
      name: "Respira",
      category: "Outdoor bar table and stool",
      price: "Rp 500.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new"
    },

    {
      image: image5,
      name: "Grifo",
      category: "Night lamp",
      price: "Rp 1.500.000",
      oldPrice: "",
      badge: "",
      badgeType: ""
    },

    {
      image: image6,
      name: "Muggo",
      category: "Small mug",
      price: "Rp 150.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new"
    },

    {
      image: image7,
      name: "Pingky",
      category: "Cute bed set",
      price: "Rp 7.000.000",
      oldPrice: "Rp 14.000.000",
      badge: "-50%",
      badgeType: "discount"
    },

    {
      image: image8,
      name: "Potty",
      category: "Minimalist flower pot",
      price: "Rp 500.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new"
    }
  ];

  return (
    <section className="products-section">

      {/* Heading */}
      <h2 className="products-title">
        Our Products
      </h2>


      {/* Products */}
      <div className="products-container">

        {products.map((product, index) => (

          <div className="product-card" key={index}>

            {/* Image */}
            <div className="product-image">

              <img
                src={product.image}
                alt={product.name}
              />

              {/* Badge */}
              {product.badge && (
                <span className={`product-badge ${product.badgeType}`}>
                  {product.badge}
                </span>
              )}


              {/* Hover Overlay */}
              <div className="product-overlay">

                <button className="cart-button">
                  Add to cart
                </button>

                <div className="product-actions">
                  <button className="action-btn">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>

                  <button className="action-btn">
                    <ArrowLeftRight size={16} />
                    <span>Compare</span>
                  </button>

                  <button className="action-btn">
                    <Heart size={16} />
                    <span>Like</span>
                  </button>
                </div>

              </div>

            </div>


            {/* Product Information */}
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


      {/* Show More button */}
     <Link to="/shop" className="show-more">
  Show More
</Link>

    </section>
  );
};

export default Products3;