import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  LogOut,
  PackagePlus,
  LoaderCircle,
  ImagePlus,
  X,
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
    otherCategory: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    sizes: "",
    colors: "",
  });

  // Selected image files
  const [selectedImages, setSelectedImages] = useState([]);

  // Image previews
  const [imagePreviews, setImagePreviews] = useState([]);


  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  };


  // =========================================
  // IMAGE SELECT
  // =========================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    // Only image files
    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== files.length) {
      toast.error("Only image files are allowed.");
    }

    // Maximum 5 images
    const totalImages = [
      ...selectedImages,
      ...imageFiles,
    ];

    if (totalImages.length > 5) {
      toast.error("You can upload maximum 5 images.");
      return;
    }

    setSelectedImages(totalImages);

    // Create previews
    const newPreviews = imageFiles.map((file) => ({
      file: file,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews((previousPreviews) => [
      ...previousPreviews,
      ...newPreviews,
    ]);

    // Reset input so same image can be selected again
    e.target.value = "";
  };


  // =========================================
  // REMOVE IMAGE
  // =========================================

  const handleRemoveImage = (index) => {
    setSelectedImages((previousImages) =>
      previousImages.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );

    setImagePreviews((previousPreviews) => {
      const previewToRemove = previousPreviews[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove.url);
      }

      return previousPreviews.filter(
        (_, imageIndex) => imageIndex !== index
      );
    });
  };


  // =========================================
  // RESET IMAGES
  // =========================================

  const resetImages = () => {
    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });

    setSelectedImages([]);
    setImagePreviews([]);
  };


  // =========================================
  // ADD PRODUCT
  // =========================================

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    // Check admin login
    if (!token) {
      toast.error(
        "Admin session not found. Please login again."
      );

      navigate("/admin-login");

      return;
    }


    // =========================================
    // REQUIRED FIELD VALIDATION
    // =========================================

    if (
      !product.name.trim() ||
      !product.sku.trim() ||
      !product.category ||
      !product.price ||
      !product.stock
    ) {
      toast.error(
        "Please fill all required fields."
      );

      return;
    }


    // =========================================
    // OTHER CATEGORY VALIDATION
    // =========================================

    if (
      product.category === "OTHER" &&
      !product.otherCategory.trim()
    ) {
      toast.error(
        "Please enter your custom category."
      );

      return;
    }


    // =========================================
    // IMAGE VALIDATION
    // =========================================

    if (selectedImages.length === 0) {
      toast.error(
        "Please select at least one product image."
      );

      return;
    }


    try {
      setLoading(true);


      // =========================================
      // FINAL CATEGORY
      // =========================================

      const finalCategory =
        product.category === "OTHER"
          ? product.otherCategory.trim()
          : product.category;


      // =========================================
      // FORM DATA
      // =========================================

      const formData = new FormData();

      formData.append(
        "name",
        product.name.trim()
      );

      formData.append(
        "sku",
        product.sku.trim()
      );

      formData.append(
        "category",
        finalCategory
      );

      formData.append(
        "description",
        product.description.trim()
      );

      formData.append(
        "price",
        product.price
      );

      formData.append(
        "discountPrice",
        product.discountPrice || "0"
      );

      formData.append(
        "stock",
        product.stock
      );


      // =========================================
      // SIZES
      // =========================================

      formData.append(
        "sizes",
        product.sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .join(",")
      );


      // =========================================
      // COLORS
      // =========================================

      formData.append(
        "colors",
        product.colors
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .join(",")
      );


      // =========================================
      // IMAGES
      // =========================================

      selectedImages.forEach((image) => {
        formData.append(
          "images",
          image
        );
      });


      console.log(
        "Product form submitted with",
        selectedImages.length,
        "image(s)"
      );


      // =========================================
      // API CALL
      // =========================================

      const response = await fetch(
        `${API_URL}/api/products`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );


      // =========================================
      // RESPONSE
      // =========================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }


      console.log(
        "ADD PRODUCT STATUS:",
        response.status
      );

      console.log(
        "ADD PRODUCT RESPONSE:",
        data
      );


      // =========================================
      // ERROR
      // =========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Product could not be added."
        );
      }


      // =========================================
      // SUCCESS
      // =========================================

      toast.success(
        "Product added successfully!"
      );


      // =========================================
      // RESET FORM
      // =========================================

      setProduct({
        name: "",
        sku: "",
        category: "",
        otherCategory: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        sizes: "",
        colors: "",
      });

      resetImages();

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


  // =========================================
  // ADMIN LOGOUT
  // =========================================

  const handleAdminLogout = () => {

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminRefreshToken"
    );

    localStorage.removeItem(
      "adminLoggedIn"
    );

    toast.success(
      "Admin logged out successfully."
    );

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };


  // =========================================
  // UI
  // =========================================

  return (
    <section className="admin-page">


      {/* =====================================
          ADMIN TOP BAR
      ====================================== */}

      <div className="admin-topbar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>

            <h2>
              Admin Portal
            </h2>

            <span>
              Furniro Administration
            </span>

          </div>

        </div>


        <button
          type="button"
          className="admin-logout"
          onClick={handleAdminLogout}
        >

          <LogOut size={17} />

          Logout

        </button>

      </div>


      {/* =====================================
          MAIN CONTAINER
      ====================================== */}

      <div className="admin-container">


        {/* =====================================
            WELCOME SECTION
        ====================================== */}

        <div className="admin-welcome">

          <div className="admin-welcome-text">

            <p>
              ADMINISTRATION
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <span>
              Manage your store products from
              the administration portal.
            </span>

          </div>


          <div className="admin-status">

            <span></span>

            Admin Online

          </div>

        </div>


        {/* =====================================
            ADD PRODUCT CARD
        ====================================== */}

        <div className="admin-card">


          {/* CARD HEADER */}

          <div className="admin-card-title">

            <div className="admin-title-icon">

              <PackagePlus size={24} />

            </div>

            <div>

              <h2>
                Add New Product
              </h2>

              <p>
                Add a new product to your store.
              </p>

            </div>

          </div>


          {/* =====================================
              PRODUCT FORM
          ====================================== */}

          <form
            className="product-form"
            onSubmit={handleAddProduct}
          >


            {/* PRODUCT NAME */}

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


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category *
              </label>

              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="category-select"
              >

                <option value="">
                  Select Category
                </option>

                <option value="SOFAS">
                  SOFAS
                </option>

                <option value="CHAIRS">
                  CHAIRS
                </option>

                <option value="TABLES">
                  TABLES
                </option>

                <option value="BEDS">
                  BEDS
                </option>

                <option value="STORAGE">
                  STORAGE
                </option>

                <option value="LIGHTING">
                  LIGHTING
                </option>

                <option value="DECOR">
                  DECOR
                </option>

                <option value="OTHER">
                  OTHER
                </option>

              </select>

            </div>


            {/* OTHER CATEGORY */}

            {product.category === "OTHER" && (

              <div className="form-group">

                <label>
                  Other Category *
                </label>

                <input
                  type="text"
                  name="otherCategory"
                  value={product.otherCategory}
                  onChange={handleChange}
                  placeholder="Enter your custom category"
                />

              </div>

            )}


            {/* PRICE */}

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
                min="0"
              />

            </div>


            {/* DISCOUNT PRICE */}

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
                min="0"
              />

            </div>


            {/* STOCK */}

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
                min="0"
              />

            </div>


            {/* DESCRIPTION */}

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


            {/* =====================================
                PRODUCT IMAGES
            ====================================== */}

            <div className="form-group full-width">

              <label>
                Product Images *
              </label>


              <div className="image-upload-box">

                <input
                  id="product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="image-file-input"
                />


                <label
                  htmlFor="product-images"
                  className="image-upload-label"
                >

                  <ImagePlus size={25} />

                  <span>
                    Choose Product Images
                  </span>

                  <small>
                    JPG, PNG, WEBP — Maximum 5 images
                  </small>

                </label>

              </div>


              {/* IMAGE PREVIEWS */}

              {imagePreviews.length > 0 && (

                <div className="image-preview-grid">

                  {imagePreviews.map(
                    (preview, index) => (

                      <div
                        className="image-preview-card"
                        key={`${preview.url}-${index}`}
                      >

                        <img
                          src={preview.url}
                          alt={`Product preview ${index + 1}`}
                        />


                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() =>
                            handleRemoveImage(index)
                          }
                          aria-label="Remove image"
                        >

                          <X size={15} />

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}


              {selectedImages.length > 0 && (

                <small className="image-count">

                  {selectedImages.length} image
                  {selectedImages.length > 1
                    ? "s"
                    : ""} selected

                </small>

              )}

            </div>


            {/* SIZES */}

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

              <small>
                Example: XS, L, XL
              </small>

            </div>


            {/* COLORS */}

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

              <small>
                Separate colors with commas.
              </small>

            </div>


            {/* SUBMIT */}

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