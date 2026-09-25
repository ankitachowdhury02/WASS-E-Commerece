import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  LogOut,
  PackagePlus,
  LoaderCircle,
} from "lucide-react";

import { toast } from "react-toastify";

import "./Admin.css";

const API_URL = "https://ecomm-qy13.onrender.com";

const Admin = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    images: "",
    sizes: "",
    colors: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast.error("Admin session not found. Please login again.");
      navigate("/admin-login");
      return;
    }

    if (
      !product.name ||
      !product.sku ||
      !product.category ||
      !product.price ||
      !product.stock
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description,
        price: Number(product.price),
        discountPrice: product.discountPrice
          ? Number(product.discountPrice)
          : 0,
        stock: Number(product.stock),

        images: product.images
          ? product.images
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

        sizes: product.sizes
          ? product.sizes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

        colors: product.colors
          ? product.colors
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      };

      console.log("PRODUCT DATA:", productData);

      const response = await fetch(
        `${API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      console.log(
        "ADD PRODUCT STATUS:",
        response.status
      );

      console.log(
        "ADD PRODUCT RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message || "Product could not be added."
        );
      }

      toast.success(
        "Product added successfully!"
      );

      setProduct({
        name: "",
        sku: "",
        category: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        images: "",
        sizes: "",
        colors: "",
      });

    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      toast.error(
        error.message ||
        "Something went wrong while adding product."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminLoggedIn");

    toast.success("Admin logged out.");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <section className="admin-page">

      {/* ================= HEADER ================= */}

      <div className="admin-topbar">

        <div className="admin-brand">
          <ShieldCheck size={25} />

          <div>
            <h2>Admin Portal</h2>
            <span>Furniro Administration</span>
          </div>
        </div>

        <button
          className="admin-logout"
          onClick={handleAdminLogout}
        >
          <LogOut size={17} />
          Logout
        </button>

      </div>


      {/* ================= MAIN ================= */}

      <div className="admin-container">

        {/* Welcome */}

        <div className="admin-welcome">

          <div>
            <p>ADMINISTRATION</p>

            <h1>
              Admin Dashboard
            </h1>

            <span>
              Your admin authentication is working successfully.
            </span>
          </div>

          <div className="admin-status">
            <span></span>
            Admin Online
          </div>

        </div>


        {/* ================= ADD PRODUCT ================= */}

        <div className="admin-card">

          <div className="admin-card-title">

            <div className="admin-title-icon">
              <PackagePlus size={24} />
            </div>

            <div>
              <h2>Add New Product</h2>

              <p>
                Add a new product to your store.
              </p>
            </div>

          </div>


          <form
            className="product-form"
            onSubmit={handleAddProduct}
          >

            {/* Product Name */}

            <div className="form-group">
              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Example: Wooden Chair"
              />
            </div>


            {/* SKU */}

            <div className="form-group">
              <label>
                SKU *
              </label>

              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                placeholder="Example: WC001"
              />
            </div>


            {/* Category */}

            <div className="form-group">
              <label>
                Category *
              </label>

              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Example: CHAIRS"
              />
            </div>


            {/* Price */}

            <div className="form-group">
              <label>
                Price *
              </label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Example: 6500"
              />
            </div>


            {/* Discount Price */}

            <div className="form-group">
              <label>
                Discount Price
              </label>

              <input
                type="number"
                name="discountPrice"
                value={product.discountPrice}
                onChange={handleChange}
                placeholder="Example: 250"
              />
            </div>


            {/* Stock */}

            <div className="form-group">
              <label>
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Example: 10"
              />
            </div>


            {/* Description */}

            <div className="form-group full-width">
              <label>
                Description
              </label>

              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description..."
                rows="4"
              ></textarea>
            </div>


            {/* Images */}

            <div className="form-group full-width">
              <label>
                Images
              </label>

              <input
                type="text"
                name="images"
                value={product.images}
                onChange={handleChange}
                placeholder="sofa-1.jpg, sofa-2.jpg"
              />

              <small>
                Separate multiple image names with comma.
              </small>
            </div>


            {/* Sizes */}

            <div className="form-group">
              <label>
                Sizes
              </label>

              <input
                type="text"
                name="sizes"
                value={product.sizes}
                onChange={handleChange}
                placeholder="XS, L, XL"
              />
            </div>


            {/* Colors */}

            <div className="form-group">
              <label>
                Colors
              </label>

              <input
                type="text"
                name="colors"
                value={product.colors}
                onChange={handleChange}
                placeholder="Black, Blue, Pink, Green"
              />
            </div>


            {/* Submit */}

            <div className="form-submit">

              <button
                type="submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="admin-spinner"
                    />

                    Adding Product...
                  </>
                ) : (
                  <>
                    <PackagePlus size={18} />

                    Add Product
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </section>
  );
};

export default Admin;