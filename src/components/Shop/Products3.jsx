import React, { useState } from "react";
import "./Products3.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";

import image1 from "../../assets/Balcony.png";
import image2 from "../../assets/Laptop.png";
import image3 from "../../assets/Chair.png";
import image4 from "../../assets/Lamp.png";
import image5 from "../../assets/Kitchen.png";
import image6 from "../../assets/Decorate room.png";
import image7 from "../../assets/breakfast.png";
import image8 from "../../assets/Flowervase.png";
import image9 from "../../assets/Dining Space.png";
import image10 from "../../assets/Modern Living.png";
import image11 from "../../assets/bedroom.png";
import image12 from "../../assets/living room.png";
import image13 from "../../assets/dining.png";
import image14 from "../../assets/Inner Peace.png";
import image15 from "../../assets/stools.png";

import { Share2, ArrowLeftRight, Heart } from "lucide-react";

const Products3 = ({
  currentPage: externalPage,
  setCurrentPage: setExternalPage,
}) => {
  const { addToCart } = useCart();
  // All 48 distinct products (16 items per page for 3 full distinct pages)
  const allProducts = [
    // --- PAGE 1 (Items 1 to 16) ---
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
    {
      id: 9,
      image: image9,
      name: "Tivoli 6-Seater Sheesham Dining Set",
      category: "Solid Sheesham Dining Table",
      price: "₹ 32,999",
      oldPrice: "₹ 39,999",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 10,
      image: image10,
      name: "Arka Scandinavian Fabric Sofa",
      category: "Premium 3-Seater Fabric Sofa",
      price: "₹ 22,499",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 11,
      image: image11,
      name: "Nerina Teak Queen Bed with Storage",
      category: "Solid Teak Queen Size Bed",
      price: "₹ 28,999",
      oldPrice: "₹ 36,999",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 12,
      image: image12,
      name: "Velora Modern Living Room Set",
      category: "Contemporary Living Suite",
      price: "₹ 38,999",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 13,
      image: image13,
      name: "Dinex 4-Seater Compact Dining Table",
      category: "Compact Mango Wood Dining",
      price: "₹ 14,999",
      oldPrice: "₹ 17,999",
      badge: "-15%",
      badgeType: "discount",
    },
    {
      id: 14,
      image: image14,
      name: "Solis King Size Master Bedroom Set",
      category: "Luxury Upholstered Bedroom Suite",
      price: "₹ 44,999",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 15,
      image: image15,
      name: "Kanso Handcrafted Wooden Stool",
      category: "Solid Sheesham Round Stool",
      price: "₹ 1,799",
      oldPrice: "₹ 2,499",
      badge: "-25%",
      badgeType: "discount",
    },
    {
      id: 16,
      image: image1,
      name: "Balcor Balcony Cane Lounge Set",
      category: "Weatherproof Cane Chair Set",
      price: "₹ 8,999",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },

    // --- PAGE 2 (Items 17 to 32) ---
    {
      id: 17,
      image: image3,
      name: "Asgard Cushioned Armchair",
      category: "Ergonomic Teak Armchair",
      price: "₹ 7,499",
      oldPrice: "₹ 8,999",
      badge: "-15%",
      badgeType: "discount",
    },
    {
      id: 18,
      image: image4,
      name: "Helios Brass Pendant Ceiling Lamp",
      category: "Modern Hanging Pendant Light",
      price: "₹ 2,499",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 19,
      image: image10,
      name: "Vardo L-Shape Sectional Corner Sofa",
      category: "Luxury Fabric Sectional Sofa",
      price: "₹ 42,999",
      oldPrice: "₹ 54,999",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 20,
      image: image2,
      name: "Soren Solid Wood Study Desk Chair",
      category: "Workstation Ergonomic Chair",
      price: "₹ 3,999",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 21,
      image: image9,
      name: "Zephyr 6-Seater Family Dining Table",
      category: "Solid Teak Dining Table",
      price: "₹ 29,999",
      oldPrice: "₹ 36,999",
      badge: "-18%",
      badgeType: "discount",
    },
    {
      id: 22,
      image: image5,
      name: "Artisan Kitchen Hanging Counter Lamp",
      category: "Warm Amber Spotlight",
      price: "₹ 1,999",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 23,
      image: image14,
      name: "Elysian Velvet Upholstered King Bed",
      category: "Luxury Cushioned King Bed",
      price: "₹ 39,999",
      oldPrice: "₹ 49,999",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 24,
      image: image8,
      name: "Botanica Terracotta Ceramic Urn",
      category: "Handmade Indian Ceramic Vase",
      price: "₹ 899",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 25,
      image: image15,
      name: "Nordik High Wooden Bar Counter Stool",
      category: "Solid Wood Kitchen Bar Stool",
      price: "₹ 2,499",
      oldPrice: "₹ 3,199",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 26,
      image: image6,
      name: "Marlo Wall Mounted Sheesham Shelf",
      category: "Handcrafted Floating Wooden Shelf",
      price: "₹ 1,699",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 27,
      image: image7,
      name: "Serena Floral Cotton Bedcover Set",
      category: "Jaipuri Block Print Cotton Bed Set",
      price: "₹ 3,499",
      oldPrice: "₹ 4,499",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 28,
      image: image1,
      name: "Terrace Outdoor Wicker Armchair",
      category: "All-Weather Wicker Lounge Chair",
      price: "₹ 5,999",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 29,
      image: image11,
      name: "Aurora Solid Sheesham Bedroom Suite",
      category: "Complete Teakwood Master Bedroom",
      price: "₹ 48,999",
      oldPrice: "₹ 59,999",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 30,
      image: image12,
      name: "Haven Modular Curved Living Set",
      category: "Luxury Corner Living Lounge",
      price: "₹ 34,999",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 31,
      image: image13,
      name: "Boreal Round Mango Wood Dining Table",
      category: "4-Seater Round Dining Table",
      price: "₹ 16,999",
      oldPrice: "₹ 21,999",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 32,
      image: image4,
      name: "Lumina Minimalist Bedside Reading Lamp",
      category: "Contemporary Metal Table Lamp",
      price: "₹ 1,299",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },

    // --- PAGE 3 (Items 33 to 48) ---
    {
      id: 33,
      image: image10,
      name: "Astrid Royal Velvet 2-Seater Sofa",
      category: "Premium Emerald Velvet Loveseat",
      price: "₹ 21,999",
      oldPrice: "₹ 27,999",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 34,
      image: image3,
      name: "Lyra Mid-Century Teak Lounge Chair",
      category: "Handcrafted Teak Accent Chair",
      price: "₹ 6,499",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 35,
      image: image14,
      name: "Freya Royal Rajputana Canopy Bed",
      category: "Handcarved Sheesham 4-Poster Bed",
      price: "₹ 54,999",
      oldPrice: "₹ 72,999",
      badge: "-25%",
      badgeType: "discount",
    },
    {
      id: 36,
      image: image5,
      name: "Canyon Ambient Kitchen Under-Cabinet Light",
      category: "Warm LED Accent Lighting",
      price: "₹ 999",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 37,
      image: image15,
      name: "Novo Sculptural Solid Wood Footstool",
      category: "Artisan Low Wooden Footstool",
      price: "₹ 1,899",
      oldPrice: "₹ 2,399",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 38,
      image: image8,
      name: "Flora Hand-Glazed Terracotta Urn",
      category: "Artisan Indian Clay Flower Pot",
      price: "₹ 799",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 39,
      image: image1,
      name: "Breeze Folding Sheesham Balcony Chair",
      category: "Foldable Solid Teak Garden Chair",
      price: "₹ 3,299",
      oldPrice: "₹ 4,199",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 40,
      image: image7,
      name: "Cozy Rest Handwoven Kantha Bedspread",
      category: "Heritage Cotton Handstitched Quilt",
      price: "₹ 2,999",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 41,
      image: image9,
      name: "Apex 8-Seater Grand Royal Dining Table",
      category: "Solid Teakwood Grand Dining Set",
      price: "₹ 49,999",
      oldPrice: "₹ 59,999",
      badge: "-18%",
      badgeType: "discount",
    },
    {
      id: 42,
      image: image2,
      name: "Studio High-Back Mesh Work Chair",
      category: "Ergonomic Lumbar Support Chair",
      price: "₹ 6,999",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 43,
      image: image6,
      name: "Urban Handcrafted Brass Table Accent",
      category: "Artisanal Metallic Home Decor",
      price: "₹ 899",
      oldPrice: "₹ 1,299",
      badge: "-30%",
      badgeType: "discount",
    },
    {
      id: 44,
      image: image11,
      name: "Zenith Solid Teak Hydraulic Bed",
      category: "King Size Bed with Hydraulic Storage",
      price: "₹ 36,999",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 45,
      image: image12,
      name: "Paloma Contemporary Wingback Armchair",
      category: "High Back Linen Accent Chair",
      price: "₹ 9,999",
      oldPrice: "₹ 12,499",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 46,
      image: image13,
      name: "Gustav Extendable Teak Dining Table",
      category: "6-to-8 Seater Extendable Dining",
      price: "₹ 26,999",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 47,
      image: image4,
      name: "Solis Arc Brass Floor Standing Lamp",
      category: "Curved Brass Living Room Floor Lamp",
      price: "₹ 4,999",
      oldPrice: "₹ 6,299",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 48,
      image: image15,
      name: "Tivoli Cushioned Sheesham Pouf Stool",
      category: "Low Cushioned Wooden Footstool",
      price: "₹ 1,499",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
  ];

  // Internal state fallback if not controlled from parent
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = externalPage !== undefined ? externalPage : internalPage;
  const setCurrentPage = setExternalPage || setInternalPage;

  // 16 products per page
  const productsPerPage = 16;

  // Pagination calculation
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // Products for the current page
  const currentProducts = allProducts.slice(startIndex, endIndex);

  // Smooth scroll and page navigation
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      const section = document.querySelector(".products-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
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

  return (
    <section className="products-section">
      {/* Products Grid with key to animate smoothly on page change */}
      <div className="products-container" key={currentPage}>
        {currentProducts.map((product) => (
          <div className="product-card" key={product.id}>
            {/* Image */}
            <div className="product-image">
              <img src={product.image} alt={product.name} />

              {/* Badge */}
              {product.badge && (
                <span className={`product-badge ${product.badgeType}`}>
                  {product.badge}
                </span>
              )}

              {/* Hover Overlay */}
              <div className="product-overlay">
           <button
  className="cart-button"
  onClick={() => {
    addToCart(product);

    toast.success(`${product.name} added to cart!`);
  }}
>
  Add to cart
</button>

                <div className="product-actions">
                  <button className="action-btn">
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>

                  <button className="action-btn">
                    <ArrowLeftRight size={14} />
                    <span>Compare</span>
                  </button>

                  <button className="action-btn">
                    <Heart size={14} />
                    <span>Like</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Information */}
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

      {/* Pagination */}
      <div className="pagination">
        {/* Prev */}
        {currentPage > 1 && (
          <button className="prev-btn" onClick={prevPage}>
            Prev
          </button>
        )}

        {/* Page 1 */}
        <button
          className={currentPage === 1 ? "active" : ""}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>

        {/* Page 2 */}
        <button
          className={currentPage === 2 ? "active" : ""}
          onClick={() => handlePageChange(2)}
        >
          2
        </button>

        {/* Page 3 */}
        <button
          className={currentPage === 3 ? "active" : ""}
          onClick={() => handlePageChange(3)}
        >
          3
        </button>

        {/* Next */}
        <button
          className="next-btn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Products3;
