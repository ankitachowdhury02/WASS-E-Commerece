import React, { useState } from "react";
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
  // All 48 distinct products (16 items per page for 3 full distinct pages)
  const allProducts = [
    // --- PAGE 1 (Items 1 to 16) ---
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
    {
      id: 9,
      image: image9,
      name: "Tivoli",
      category: "Modern dining table set",
      price: "Rp 9.500.000",
      oldPrice: "Rp 12.000.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 10,
      image: image10,
      name: "Arka",
      category: "Scandinavian lounge sofa",
      price: "Rp 6.200.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 11,
      image: image11,
      name: "Nerina",
      category: "Minimalist queen bed",
      price: "Rp 8.400.000",
      oldPrice: "Rp 10.500.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 12,
      image: image12,
      name: "Velora",
      category: "Cozy living room set",
      price: "Rp 11.000.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 13,
      image: image13,
      name: "Dinex",
      category: "Compact wooden dining",
      price: "Rp 4.300.000",
      oldPrice: "Rp 5.000.000",
      badge: "-15%",
      badgeType: "discount",
    },
    {
      id: 14,
      image: image14,
      name: "Solis",
      category: "Minimalist bedroom suite",
      price: "Rp 13.500.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 15,
      image: image15,
      name: "Kanso",
      category: "Oak wooden stool",
      price: "Rp 750.000",
      oldPrice: "Rp 1.000.000",
      badge: "-25%",
      badgeType: "discount",
    },
    {
      id: 16,
      image: image1,
      name: "Balcor",
      category: "Balcony lounge set",
      price: "Rp 3.200.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },

    // --- PAGE 2 (Items 17 to 32) ---
    {
      id: 17,
      image: image3,
      name: "Asgard",
      category: "Ergonomic leather chair",
      price: "Rp 3.800.000",
      oldPrice: "Rp 4.500.000",
      badge: "-15%",
      badgeType: "discount",
    },
    {
      id: 18,
      image: image4,
      name: "Helios",
      category: "Modern pendant lamp",
      price: "Rp 1.200.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 19,
      image: image10,
      name: "Vardo",
      category: "Luxury sectional sofa",
      price: "Rp 12.800.000",
      oldPrice: "Rp 16.000.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 20,
      image: image2,
      name: "Soren",
      category: "Workstation desk chair",
      price: "Rp 2.900.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 21,
      image: image9,
      name: "Zephyr",
      category: "Family dining table",
      price: "Rp 8.200.000",
      oldPrice: "Rp 10.000.000",
      badge: "-18%",
      badgeType: "discount",
    },
    {
      id: 22,
      image: image5,
      name: "Artisan",
      category: "Kitchen counter lamp",
      price: "Rp 1.400.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 23,
      image: image14,
      name: "Elysian",
      category: "Luxury upholstered bed",
      price: "Rp 15.000.000",
      oldPrice: "Rp 18.500.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 24,
      image: image8,
      name: "Botanica",
      category: "Nordic ceramic vase",
      price: "Rp 420.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 25,
      image: image15,
      name: "Nordik",
      category: "Bar counter stool",
      price: "Rp 890.000",
      oldPrice: "Rp 1.100.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 26,
      image: image6,
      name: "Marlo",
      category: "Decorative wall shelf",
      price: "Rp 980.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 27,
      image: image7,
      name: "Serena",
      category: "Pastel linen bed set",
      price: "Rp 5.800.000",
      oldPrice: "Rp 7.200.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 28,
      image: image1,
      name: "Terrace",
      category: "Outdoor wicker armchair",
      price: "Rp 2.800.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 29,
      image: image11,
      name: "Aurora",
      category: "Modern master bedroom set",
      price: "Rp 14.200.000",
      oldPrice: "Rp 17.500.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 30,
      image: image12,
      name: "Haven",
      category: "Modular corner lounge",
      price: "Rp 9.600.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 31,
      image: image13,
      name: "Boreal",
      category: "Round wooden dining table",
      price: "Rp 5.200.000",
      oldPrice: "Rp 6.500.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 32,
      image: image4,
      name: "Lumina",
      category: "Minimalist reading lamp",
      price: "Rp 780.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },

    // --- PAGE 3 (Items 33 to 48) ---
    {
      id: 33,
      image: image10,
      name: "Astrid",
      category: "Premium velvet sofa",
      price: "Rp 8.900.000",
      oldPrice: "Rp 11.000.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 34,
      image: image3,
      name: "Lyra",
      category: "Mid-century wooden chair",
      price: "Rp 2.100.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 35,
      image: image14,
      name: "Freya",
      category: "Deluxe king canopy bed",
      price: "Rp 16.500.000",
      oldPrice: "Rp 22.000.000",
      badge: "-25%",
      badgeType: "discount",
    },
    {
      id: 36,
      image: image5,
      name: "Canyon",
      category: "Under-cabinet spotlight",
      price: "Rp 650.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 37,
      image: image15,
      name: "Novo",
      category: "Sculptural wooden stool",
      price: "Rp 920.000",
      oldPrice: "Rp 1.150.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 38,
      image: image8,
      name: "Flora",
      category: "Handmade clay urn",
      price: "Rp 620.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 39,
      image: image1,
      name: "Breeze",
      category: "Folding balcony chair",
      price: "Rp 1.750.000",
      oldPrice: "Rp 2.200.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 40,
      image: image7,
      name: "Cozy Rest",
      category: "Cotton quilt bedding",
      price: "Rp 4.600.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 41,
      image: image9,
      name: "Apex",
      category: "Solid walnut dining set",
      price: "Rp 13.900.000",
      oldPrice: "Rp 17.000.000",
      badge: "-18%",
      badgeType: "discount",
    },
    {
      id: 42,
      image: image2,
      name: "Studio",
      category: "Ergonomic mesh task chair",
      price: "Rp 3.400.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 43,
      image: image6,
      name: "Urban",
      category: "Ceramic decor accent",
      price: "Rp 350.000",
      oldPrice: "Rp 500.000",
      badge: "-30%",
      badgeType: "discount",
    },
    {
      id: 44,
      image: image11,
      name: "Zenith",
      category: "Platform storage bed",
      price: "Rp 9.800.000",
      oldPrice: "",
      badge: "",
      badgeType: "",
    },
    {
      id: 45,
      image: image12,
      name: "Paloma",
      category: "Contemporary accent chair",
      price: "Rp 4.700.000",
      oldPrice: "Rp 5.800.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 46,
      image: image13,
      name: "Gustav",
      category: "Extendable dining table",
      price: "Rp 7.600.000",
      oldPrice: "",
      badge: "New",
      badgeType: "new",
    },
    {
      id: 47,
      image: image4,
      name: "Solis Arc",
      category: "Curved metal floor lamp",
      price: "Rp 2.400.000",
      oldPrice: "Rp 3.000.000",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 48,
      image: image15,
      name: "Tivoli Stool",
      category: "Low cushioned footstool",
      price: "Rp 850.000",
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
                <button className="cart-button">Add to cart</button>

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
