import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  LogOut,
  PackagePlus,
  LoaderCircle,
  ImagePlus,
  X,
  RefreshCw,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { toast } from "react-toastify";

import "./Admin.css";

const API_URL = "https://ecomm-qy13.onrender.com";

const Admin = () => {
  const navigate = useNavigate();

  // =====================================================
  // ADD PRODUCT LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // ADMIN PRODUCTS
  // =====================================================

  const [adminProducts, setAdminProducts] = useState([]);

  const [productsLoading, setProductsLoading] =
    useState(false);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);

  const [productsPerPage, setProductsPerPage] =
    useState(10);

  const [totalProducts, setTotalProducts] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  // =====================================================
  // PRODUCT FORM
  // =====================================================

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

  // =====================================================
  // SELECTED IMAGES
  // =====================================================

  const [selectedImages, setSelectedImages] =
    useState([]);

  // =====================================================
  // IMAGE PREVIEWS
  // =====================================================

  const [imagePreviews, setImagePreviews] =
    useState([]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== files.length) {
      toast.error(
        "Only image files are allowed."
      );
    }

    const totalImages = [
      ...selectedImages,
      ...imageFiles,
    ];

    if (totalImages.length > 5) {
      toast.error(
        "You can upload maximum 5 images."
      );

      return;
    }

    setSelectedImages(totalImages);

    const newPreviews = imageFiles.map(
      (file) => ({
        file: file,
        url: URL.createObjectURL(file),
      })
    );

    setImagePreviews(
      (previousPreviews) => [
        ...previousPreviews,
        ...newPreviews,
      ]
    );

    e.target.value = "";
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const handleRemoveImage = (index) => {
    setSelectedImages(
      (previousImages) =>
        previousImages.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );

    setImagePreviews(
      (previousPreviews) => {
        const previewToRemove =
          previousPreviews[index];

        if (previewToRemove) {
          URL.revokeObjectURL(
            previewToRemove.url
          );
        }

        return previousPreviews.filter(
          (_, imageIndex) =>
            imageIndex !== index
        );
      }
    );
  };

  // =====================================================
  // RESET IMAGES
  // =====================================================

  const resetImages = () => {
    imagePreviews.forEach(
      (preview) => {
        URL.revokeObjectURL(
          preview.url
        );
      }
    );

    setSelectedImages([]);
    setImagePreviews([]);
  };

  // =====================================================
  // GET PRODUCT IMAGE
  // =====================================================

  const getProductImage = (productItem) => {
    if (!productItem) {
      return null;
    }

    const images = productItem.images;

    if (!images) {
      return null;
    }

    // Array images
    if (
      Array.isArray(images) &&
      images.length > 0
    ) {
      const firstImage = images[0];

      // String URL
      if (
        typeof firstImage === "string"
      ) {
        if (
          firstImage.startsWith("http")
        ) {
          return firstImage;
        }

        return `${API_URL}${
          firstImage.startsWith("/")
            ? ""
            : "/"
        }${firstImage}`;
      }

      // Object image
      if (
        typeof firstImage === "object"
      ) {
        const imageUrl =
          firstImage.url ||
          firstImage.path ||
          firstImage.src ||
          firstImage.image;

        if (!imageUrl) {
          return null;
        }

        if (
          imageUrl.startsWith("http")
        ) {
          return imageUrl;
        }

        return `${API_URL}${
          imageUrl.startsWith("/")
            ? ""
            : "/"
        }${imageUrl}`;
      }
    }

    // Single string image
    if (
      typeof images === "string"
    ) {
      if (
        images.startsWith("http")
      ) {
        return images;
      }

      return `${API_URL}${
        images.startsWith("/")
          ? ""
          : "/"
      }${images}`;
    }

    return null;
  };

  // =====================================================
  // GET ALL ADMIN PRODUCTS
  // =====================================================

  const fetchAdminProducts = async (
    page = currentPage
  ) => {
    try {
      setProductsLoading(true);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      // =================================================
      // CHECK ADMIN LOGIN
      // =================================================

      if (!token) {
        toast.error(
          "Admin session not found. Please login again."
        );

        navigate("/admin-login");

        return;
      }

      // =================================================
      // API URL
      // =================================================

      const apiUrl =
        `${API_URL}/api/products/admin` +
        `?page=${page}` +
        `&limit=${productsPerPage}`;

      console.log(
        "ADMIN PRODUCTS API:",
        apiUrl
      );

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(
        apiUrl,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      // =================================================
      // RESPONSE
      // =================================================

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      console.log(
        "ADMIN PRODUCTS STATUS:",
        response.status
      );

      console.log(
        "ADMIN PRODUCTS RESPONSE:",
        data
      );

      // =================================================
      // 401
      // =================================================

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminRefreshToken"
        );

        localStorage.removeItem(
          "adminLoggedIn"
        );

        toast.error(
          "Admin session expired. Please login again."
        );

        navigate("/admin-login");

        return;
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load products."
        );
      }

      // =================================================
      // FIND PRODUCTS
      // =================================================

      let products = [];

      if (Array.isArray(data)) {
        products = data;
      }

      else if (
        Array.isArray(
          data.products
        )
      ) {
        products =
          data.products;
      }

      else if (
        Array.isArray(
          data.data
        )
      ) {
        products =
          data.data;
      }

      else if (
        Array.isArray(
          data.items
        )
      ) {
        products =
          data.items;
      }

      else if (
        data.data &&
        Array.isArray(
          data.data.products
        )
      ) {
        products =
          data.data.products;
      }

      // =================================================
      // SET PRODUCTS
      // =================================================

      setAdminProducts(
        products
      );

      // =================================================
      // FIND TOTAL PRODUCTS
      // =================================================

      const possibleTotal =
        data.total ??
        data.totalProducts ??
        data.count ??
        data.data?.total ??
        data.data?.totalProducts ??
        data.pagination?.total ??
        data.meta?.total;

      if (
        possibleTotal !== undefined &&
        possibleTotal !== null
      ) {
        const numericTotal =
          Number(
            possibleTotal
          );

        if (
          !Number.isNaN(
            numericTotal
          )
        ) {
          setTotalProducts(
            numericTotal
          );

          setTotalPages(
            Math.max(
              1,
              Math.ceil(
                numericTotal /
                  productsPerPage
              )
            )
          );
        }
      }

      // =================================================
      // FIND TOTAL PAGES
      // =================================================

      const possibleTotalPages =
        data.totalPages ??
        data.data?.totalPages ??
        data.pagination?.totalPages ??
        data.meta?.totalPages;

      if (
        possibleTotalPages !==
          undefined &&
        possibleTotalPages !== null
      ) {
        const numericPages =
          Number(
            possibleTotalPages
          );

        if (
          !Number.isNaN(
            numericPages
          )
        ) {
          setTotalPages(
            Math.max(
              1,
              numericPages
            )
          );
        }
      }

      // =================================================
      // IF TOTAL IS NOT PROVIDED
      // =================================================

      if (
        possibleTotal ===
          undefined &&
        possibleTotalPages ===
          undefined
      ) {
        /*
          If backend does not send totalPages,
          we use the number of received products.

          If we receive exactly 10 products,
          there may be another page.

          If less than 10 products arrive,
          current page is treated as last page.
        */

        if (
          products.length ===
          productsPerPage
        ) {
          setTotalPages(
            Math.max(
              totalPages,
              page + 1
            )
          );
        } else {
          setTotalPages(
            Math.max(
              1,
              page
            )
          );
        }
      }

      // =================================================
      // SET CURRENT PAGE
      // =================================================

      setCurrentPage(page);

    } catch (error) {
      console.error(
        "ADMIN PRODUCTS ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Something went wrong while loading products."
      );

      setAdminProducts([]);

    } finally {
      setProductsLoading(false);
    }
  };

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchAdminProducts(
      currentPage
    );
  }, [
    currentPage,
    productsPerPage,
  ]);

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CHANGE PRODUCTS PER PAGE
  // =====================================================

  const handleProductsPerPageChange = (
    e
  ) => {
    const newLimit =
      Number(e.target.value);

    setProductsPerPage(
      newLimit
    );

    setCurrentPage(1);
  };

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = async (
    e
  ) => {
    e.preventDefault();

    const token =
      localStorage.getItem(
        "adminToken"
      );

    // =================================================
    // CHECK LOGIN
    // =================================================

    if (!token) {
      toast.error(
        "Admin session not found. Please login again."
      );

      navigate(
        "/admin-login"
      );

      return;
    }

    // =================================================
    // REQUIRED FIELDS
    // =================================================

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

    // =================================================
    // OTHER CATEGORY
    // =================================================

    if (
      product.category ===
        "OTHER" &&
      !product.otherCategory.trim()
    ) {
      toast.error(
        "Please enter your custom category."
      );

      return;
    }

    // =================================================
    // IMAGE VALIDATION
    // =================================================

    if (
      selectedImages.length === 0
    ) {
      toast.error(
        "Please select at least one product image."
      );

      return;
    }

    try {
      setLoading(true);

      // =================================================
      // FINAL CATEGORY
      // =================================================

      const finalCategory =
        product.category ===
          "OTHER"
          ? product.otherCategory.trim()
          : product.category;

      // =================================================
      // FORM DATA
      // =================================================

      const formData =
        new FormData();

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
        product.discountPrice ||
          "0"
      );

      formData.append(
        "stock",
        product.stock
      );

      // =================================================
      // SIZES
      // =================================================

      formData.append(
        "sizes",
        product.sizes
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean)
          .join(",")
      );

      // =================================================
      // COLORS
      // =================================================

      formData.append(
        "colors",
        product.colors
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean)
          .join(",")
      );

      // =================================================
      // IMAGES
      // =================================================

      selectedImages.forEach(
        (image) => {
          formData.append(
            "images",
            image
          );
        }
      );

      // =================================================
      // ADD PRODUCT API
      // =================================================

      const response =
        await fetch(
          `${API_URL}/api/products`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      // =================================================
      // RESPONSE
      // =================================================

      let data = {};

      try {
        data =
          await response.json();
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

      // =================================================
      // ERROR
      // =================================================

      if (
        !response.ok
      ) {
        throw new Error(
          data.message ||
            "Product could not be added."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      toast.success(
        "Product added successfully!"
      );

      // =================================================
      // RESET FORM
      // =================================================

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

      // =================================================
      // GO TO FIRST PAGE
      // =================================================

      setCurrentPage(1);

      // =================================================
      // FETCH FIRST PAGE
      // =================================================

      setTimeout(() => {
        fetchAdminProducts(1);
      }, 300);

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

  // =====================================================
  // LOGOUT
  // =====================================================

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

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const pageNumbers = [];

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {
    pageNumbers.push(i);
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="admin-page">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="admin-topbar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <ShieldCheck
              size={25}
            />
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
          onClick={
            handleAdminLogout
          }
        >

          <LogOut
            size={17}
          />

          Logout

        </button>

      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="admin-container">

        {/* =================================================
            WELCOME
        ================================================= */}

        <div className="admin-welcome">

          <div className="admin-welcome-text">

            <p>
              ADMINISTRATION
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <span>
              Manage your store products
              from the administration portal.
            </span>

          </div>

          <div className="admin-status">

            <span></span>

            Admin Online

          </div>

        </div>

        {/* =================================================
            ADD PRODUCT CARD
        ================================================= */}

        <div className="admin-card">

          <div className="admin-card-title">

            <div className="admin-title-icon">

              <PackagePlus
                size={24}
              />

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

          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="product-form"
            onSubmit={
              handleAddProduct
            }
          >

            {/* NAME */}

            <div className="form-group">

              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={
                  product.name
                }
                onChange={
                  handleChange
                }
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
                value={
                  product.sku
                }
                onChange={
                  handleChange
                }
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
                value={
                  product.category
                }
                onChange={
                  handleChange
                }
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

            {product.category ===
              "OTHER" && (

              <div className="form-group">

                <label>
                  Other Category *
                </label>

                <input
                  type="text"
                  name="otherCategory"
                  value={
                    product.otherCategory
                  }
                  onChange={
                    handleChange
                  }
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
                value={
                  product.price
                }
                onChange={
                  handleChange
                }
                placeholder="Example: 6500"
                min="0"
              />

            </div>

            {/* DISCOUNT */}

            <div className="form-group">

              <label>
                Discount Price
              </label>

              <input
                type="number"
                name="discountPrice"
                value={
                  product.discountPrice
                }
                onChange={
                  handleChange
                }
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
                value={
                  product.stock
                }
                onChange={
                  handleChange
                }
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
                value={
                  product.description
                }
                onChange={
                  handleChange
                }
                placeholder="Enter product description..."
                rows="4"
              />

            </div>

            {/* =================================================
                IMAGES
            ================================================= */}

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
                  onChange={
                    handleImageChange
                  }
                  className="image-file-input"
                />

                <label
                  htmlFor="product-images"
                  className="image-upload-label"
                >

                  <ImagePlus
                    size={25}
                  />

                  <span>
                    Choose Product Images
                  </span>

                  <small>
                    JPG, PNG, WEBP —
                    Maximum 5 images
                  </small>

                </label>

              </div>

              {/* PREVIEWS */}

              {imagePreviews.length >
                0 && (

                <div className="image-preview-grid">

                  {imagePreviews.map(
                    (
                      preview,
                      index
                    ) => (

                      <div
                        className="image-preview-card"
                        key={
                          `${preview.url}-${index}`
                        }
                      >

                        <img
                          src={
                            preview.url
                          }
                          alt={
                            `Product preview ${
                              index + 1
                            }`
                          }
                        />

                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() =>
                            handleRemoveImage(
                              index
                            )
                          }
                        >

                          <X
                            size={15}
                          />

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

              {selectedImages.length >
                0 && (

                <small className="image-count">

                  {
                    selectedImages.length
                  }{" "}
                  image
                  {selectedImages.length >
                  1
                    ? "s"
                    : ""}{" "}
                  selected

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
                value={
                  product.sizes
                }
                onChange={
                  handleChange
                }
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
                value={
                  product.colors
                }
                onChange={
                  handleChange
                }
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
                    <PackagePlus
                      size={18}
                    />

                    Add Product
                  </>

                )}

              </button>

            </div>

          </form>

        </div>

        {/* =================================================
            ALL PRODUCTS
        ================================================= */}

        <div className="admin-card admin-products-card">

          {/* HEADER */}

          <div className="admin-products-header">

            <div
              className="admin-card-title"
              style={{
                marginBottom: 0,
                paddingBottom: 0,
                borderBottom: "none",
              }}
            >

              <div className="admin-title-icon">

                <Package
                  size={24}
                />

              </div>

              <div>

                <h2>
                  All Products
                </h2>

                <p>
                  Manage products in your store.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={() =>
                fetchAdminProducts(
                  currentPage
                )
              }
              disabled={
                productsLoading
              }
            >

              <RefreshCw
                size={17}
                className={
                  productsLoading
                    ? "admin-spinner"
                    : ""
                }
              />

              Refresh

            </button>

          </div>

          {/* =================================================
              PRODUCTS PER PAGE
          ================================================= */}

          <div className="admin-products-controls">

            <div>

              <span>
                Products per page:
              </span>

              <select
                value={
                  productsPerPage
                }
                onChange={
                  handleProductsPerPageChange
                }
              >

                <option value="10">
                  10
                </option>

                <option value="20">
                  20
                </option>

                <option value="30">
                  30
                </option>

              </select>

            </div>

            <div className="admin-product-count">

              {totalProducts >
              0
                ? `Total Products: ${totalProducts}`
                : `Page ${currentPage}`}

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {productsLoading ? (

            <div className="admin-products-loading">

              <LoaderCircle
                size={38}
                className="admin-spinner"
              />

              <p>
                Loading products...
              </p>

            </div>

          ) : adminProducts.length ===
            0 ? (

            /* =================================================
                EMPTY
            ================================================= */

            <div className="admin-products-empty">

              <Package
                size={45}
              />

              <h3>
                No Products Found
              </h3>

              <p>
                No products are available
                on this page.
              </p>

            </div>

          ) : (

            /* =================================================
                PRODUCT GRID
            ================================================= */

            <div className="admin-products-grid">

              {adminProducts.map(
                (
                  productItem,
                  index
                ) => {

                  const imageUrl =
                    getProductImage(
                      productItem
                    );

                  const productId =
                    productItem.id ||
                    productItem._id ||
                    index;

                  return (

                    <div
                      className="admin-product-card"
                      key={
                        productId
                      }
                    >

                      {/* IMAGE */}

                      <div className="admin-product-image">

                        {imageUrl ? (

                          <img
                            src={
                              imageUrl
                            }
                            alt={
                              productItem.name ||
                              "Product"
                            }
                            onError={(
                              e
                            ) => {
                              e.currentTarget.style.display =
                                "none";

                              if (
                                e.currentTarget
                                  .parentElement
                              ) {
                                e.currentTarget
                                  .parentElement
                                  .classList.add(
                                    "image-error"
                                  );
                              }
                            }}
                          />

                        ) : (

                          <div className="admin-no-image">

                            <Package
                              size={35}
                            />

                            <p>
                              No Image
                            </p>

                          </div>

                        )}

                      </div>

                      {/* INFO */}

                      <div className="admin-product-info">

                        <h3>
                          {
                            productItem.name ||
                            "Unnamed Product"
                          }
                        </h3>

                        <p>

                          <strong>
                            SKU:
                          </strong>{" "}

                          {
                            productItem.sku ||
                            "N/A"
                          }

                        </p>

                        <p>

                          <strong>
                            Category:
                          </strong>{" "}

                          {
                            productItem.category ||
                            "N/A"
                          }

                        </p>

                        <p>

                          <strong>
                            Price:
                          </strong>{" "}

                          ₹
                          {
                            productItem.price ??
                            "0"
                          }

                        </p>

                        {productItem.discountPrice !==
                          undefined &&
                          productItem.discountPrice !==
                            null &&
                          productItem.discountPrice !==
                            "" && (

                          <p>

                            <strong>
                              Discount Price:
                            </strong>{" "}

                            ₹
                            {
                              productItem.discountPrice
                            }

                          </p>

                        )}

                        <p>

                          <strong>
                            Stock:
                          </strong>{" "}

                          {
                            productItem.stock ??
                            "0"
                          }

                        </p>

                        {productItem.description && (

                          <p className="admin-product-description">

                            {
                              productItem.description
                            }

                          </p>

                        )}

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {!productsLoading &&
            adminProducts.length >
              0 &&
            totalPages > 1 && (

            <div className="admin-pagination">

              {/* PREVIOUS */}

              <button
                type="button"
                className="admin-page-arrow"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
              >

                <ChevronLeft
                  size={18}
                />

                Previous

              </button>

              {/* PAGE NUMBERS */}

              <div className="admin-page-numbers">

                {pageNumbers.map(
                  (page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage ===
                        page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handlePageChange(
                          page
                        )
                      }
                    >

                      {page}

                    </button>

                  )
                )}

              </div>

              {/* NEXT */}

              <button
                type="button"
                className="admin-page-arrow"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
              >

                Next

                <ChevronRight
                  size={18}
                />

              </button>

            </div>

          )}

        </div>

      </div>

    </section>
  );
};

export default Admin;