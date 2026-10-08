import React, { useEffect, useMemo, useState } from "react";

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

  Search,

  LayoutDashboard,

  ShoppingBag,

  Plus,

  ChevronLeft,

  ChevronRight,

  MoreHorizontal,

  Eye,

  Pencil,

  Power,

  Save,

  Boxes,

  CheckCircle2,

  AlertCircle,

  FolderKanban,

} from "lucide-react";

import { toast } from "react-toastify";

import "./Admin.css";



const API_URL = "https://ecomm-qy13.onrender.com";

const EMPTY_PRODUCT = {
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
};

const Admin = () => {

  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("products");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [productsLoading, setProductsLoading] = useState(false);

  const [adminProducts, setAdminProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [productsPerPage, setProductsPerPage] = useState(10);

  const [totalProducts, setTotalProducts] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const [product, setProduct] = useState(EMPTY_PRODUCT);

  const [selectedImages, setSelectedImages] = useState([]);

  const [imagePreviews, setImagePreviews] = useState([]);



  // Product details / edit / active-deactive state

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [detailsError, setDetailsError] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [editLoading, setEditLoading] = useState(false);

  const [statusLoading, setStatusLoading] = useState(false);

  const [editForm, setEditForm] = useState({

    name: "",

    sku: "",

    category: "",

    description: "",

    price: "",

    discountPrice: "",

    stock: "",

    sizes: "",

    colors: "",

  });



    // Edit product image management
  const [editNewImages, setEditNewImages] = useState([]);
  const [editNewImagePreviews, setEditNewImagePreviews] = useState([]);
  const [removedImageIndexes, setRemovedImageIndexes] = useState([]);

const logout = () => {

    localStorage.removeItem("adminToken");

    localStorage.removeItem("adminRefreshToken");

    localStorage.removeItem("adminLoggedIn");

    toast.success("Admin logged out successfully.");

    setTimeout(() => navigate("/login"), 400);

  };



  const getImage = (item) => {
    const images = item?.images;
    if (!images) return null;

    const first = Array.isArray(images) ? images[0] : images;
    const value =
      typeof first === "object"
        ? first?.url || first?.path || first?.src || first?.image
        : first;

    if (!value) return null;

    return String(value).startsWith("http")
      ? value
      : `${API_URL}${String(value).startsWith("/") ? "" : "/"}${value}`;
  };



  const extractProducts = (data) => {

    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.products)) return data.products;

    if (Array.isArray(data?.data)) return data.data;

    if (Array.isArray(data?.items)) return data.items;

    if (Array.isArray(data?.data?.products)) return data.data.products;

    return [];

  };



  const fetchProducts = async (page = currentPage) => {

    try {

      setProductsLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {

        toast.error("Admin session not found. Please login again.");

        navigate("/admin-login");

        return;

      }



      const response = await fetch(
        `${API_URL}/api/products/admin?page=${page}&limit=${productsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }



      if (response.status === 401) {

        localStorage.removeItem("adminToken");

        localStorage.removeItem("adminRefreshToken");

        localStorage.removeItem("adminLoggedIn");

        toast.error("Admin session expired. Please login again.");

        navigate("/admin-login");

        return;

      }

      if (!response.ok)

        throw new Error(data.message || "Failed to load products.");



      const products = extractProducts(data);

      setAdminProducts(products);



      const total =

        data.total ??

        data.totalProducts ??

        data.count ??

        data.data?.total ??

        data.data?.totalProducts ??

        data.pagination?.total ??

        data.meta?.total;

      const pages =

        data.totalPages ??

        data.data?.totalPages ??

        data.pagination?.totalPages ??

        data.meta?.totalPages;



      if (

        total !== undefined &&

        total !== null &&

        !Number.isNaN(Number(total))

      ) {

        const numericTotal = Number(total);

        setTotalProducts(numericTotal);

        setTotalPages(Math.max(1, Math.ceil(numericTotal / productsPerPage)));

      } else {

        setTotalProducts((page - 1) * productsPerPage + products.length);

        setTotalPages(

          pages

            ? Math.max(1, Number(pages))

            : products.length === productsPerPage

              ? Math.max(totalPages, page + 1)

              : Math.max(1, page),

        );

      }

      if (pages !== undefined && pages !== null && !Number.isNaN(Number(pages)))

        setTotalPages(Math.max(1, Number(pages)));

      setCurrentPage(page);

    } catch (error) {

      console.error(error);

      toast.error(

        error.message || "Something went wrong while loading products.",

      );

      setAdminProducts([]);

    } finally {

      setProductsLoading(false);

    }

  };



  useEffect(() => {

    fetchProducts(currentPage);

  }, [currentPage, productsPerPage]);



  const filteredProducts = useMemo(() => {

    const term = searchTerm.trim().toLowerCase();

    if (!term) return adminProducts;

    return adminProducts.filter(

      (item) =>

        String(item.name || "")

          .toLowerCase()

          .includes(term) ||

        String(item.sku || "")

          .toLowerCase()

          .includes(term) ||

        String(item.category || "")

          .toLowerCase()

          .includes(term),

    );

  }, [adminProducts, searchTerm]);



  const go = (page) => {

    setActivePage(page);

    setSidebarOpen(false);

    setSearchTerm("");

  };



  const handleChange = (e) =>

    setProduct((p) => ({ ...p, [e.target.name]: e.target.value }));



  const handleImageChange = (e) => {

    const files = Array.from(e.target.files).filter((file) =>

      file.type.startsWith("image/"),

    );

    if (files.length === 0) return;

    const total = [...selectedImages, ...files];

    if (total.length > 5) {

      toast.error("You can upload maximum 5 images.");

      return;

    }

    setSelectedImages(total);

    setImagePreviews((p) => [

      ...p,

      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),

    ]);

    e.target.value = "";

  };



  const removeImage = (index) => {

    setSelectedImages((p) => p.filter((_, i) => i !== index));

    setImagePreviews((p) => {

      if (p[index]) URL.revokeObjectURL(p[index].url);

      return p.filter((_, i) => i !== index);

    });

  };



  const resetImages = () => {

    imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));

    setSelectedImages([]);

    setImagePreviews([]);

  };



  const getProductId = (item) => item?._id ?? item?.id ?? null;



  const isProductActive = (item) => item?.isActive !== false;



  const normalizeListField = (value) => {

    if (Array.isArray(value)) return value.join(", ");

    return value || "";

  };



  const openProductDetails = async (item) => {

    const id = getProductId(item);

    if (!id) {

      toast.error("Product ID is missing.");

      return;

    }



    setSelectedProduct(item);

    setDetailsError("");

    setDetailsLoading(true);

    setEditMode(false);



    try {

      const response = await fetch(`${API_URL}/api/products/${id}`);

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }



      if (!response.ok) {

        throw new Error(data.message || "Failed to load product details.");

      }



      const details = data?.product || data?.data || data?.item || data;

      const finalProduct = details && typeof details === "object" ? details : item;

      setSelectedProduct(finalProduct);

      setEditForm({

        name: finalProduct.name || "",

        sku: finalProduct.sku || "",

        category: finalProduct.category || "",

        description: finalProduct.description || "",

        price: finalProduct.price ?? "",

        discountPrice: finalProduct.discountPrice ?? "",

        stock: finalProduct.stock ?? "",

        sizes: normalizeListField(finalProduct.sizes),

        colors: normalizeListField(finalProduct.colors),

      });

    } catch (error) {

      console.error(error);

      setDetailsError(error.message || "Unable to load product details.");

      setSelectedProduct(item);

      setEditForm({

        name: item.name || "",

        sku: item.sku || "",

        category: item.category || "",

        description: item.description || "",

        price: item.price ?? "",

        discountPrice: item.discountPrice ?? "",

        stock: item.stock ?? "",

        sizes: normalizeListField(item.sizes),

        colors: normalizeListField(item.colors),

      });

    } finally {

      setDetailsLoading(false);

    }

  };



  const closeProductDetails = () => {

    setSelectedProduct(null);

    setDetailsError("");

    setEditMode(false);

    setEditLoading(false);

    setStatusLoading(false);

  };



  const handleEditChange = (e) => {

    const { name, value } = e.target;

    setEditForm((prev) => ({ ...prev, [name]: value }));

  };



  const getProductImages = (item) => {
    const images = item?.images;
    if (!Array.isArray(images)) return images ? [images] : [];
    return images;
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const value = typeof image === "object"
      ? image?.url || image?.path || image?.src || image?.image
      : image;
    if (!value) return null;
    return String(value).startsWith("http")
      ? value
      : `${API_URL}${String(value).startsWith("/") ? "" : "/"}${value}`;
  };

  const resetEditImages = () => {
    editNewImagePreviews.forEach((item) => URL.revokeObjectURL(item.url));
    setEditNewImages([]);
    setEditNewImagePreviews([]);
    setRemovedImageIndexes([]);
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    if (files.length + editNewImages.length > 5) {
      toast.error("You can add maximum 5 new images at a time.");
      e.target.value = "";
      return;
    }
    setEditNewImages((prev) => [...prev, ...files]);
    setEditNewImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
    e.target.value = "";
  };

  const removeNewEditImage = (index) => {
    setEditNewImages((prev) => prev.filter((_, i) => i !== index));
    setEditNewImagePreviews((prev) => {
      if (prev[index]) URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingEditImage = (index) => {
    setRemovedImageIndexes((prev) => prev.includes(index) ? prev : [...prev, index]);
  };

  const restoreExistingEditImage = (index) => {
    setRemovedImageIndexes((prev) => prev.filter((i) => i !== index));
  };

  const updateProduct = async (e) => {

    e.preventDefault();

    const id = getProductId(selectedProduct);

    const token = localStorage.getItem("adminToken");



    if (!id || !token) {

      toast.error("Admin session not found. Please login again.");

      navigate("/admin-login");

      return;

    }



    if (!editForm.name.trim() || !editForm.sku.trim() || !editForm.category.trim()) {

      toast.error("Name, SKU and category are required.");

      return;

    }



    try {

      setEditLoading(true);

      const payload = {

        name: editForm.name.trim(),

        sku: editForm.sku.trim(),

        category: editForm.category.trim(),

        description: editForm.description.trim(),

        price: Number(editForm.price || 0),

        discountPrice: Number(editForm.discountPrice || 0),

        stock: Number(editForm.stock || 0),

        sizes: editForm.sizes

          .split(",")

          .map((x) => x.trim())

          .filter(Boolean),

        colors: editForm.colors

          .split(",")

          .map((x) => x.trim())

          .filter(Boolean),

      };



      const hasImageChanges = editNewImages.length > 0 || removedImageIndexes.length > 0;

      let requestOptions;

      if (hasImageChanges) {
        const formData = new FormData();
       // Object.entries(payload).forEach(([key, value]) => {
       //   formData.append(key, Array.isArray(value) ? value.join(",") : value);
      //  });

formData.append("name", payload.name);
formData.append("sku", payload.sku);
formData.append("category", payload.category);
formData.append("description", payload.description);
formData.append("price", String(payload.price));
formData.append("discountPrice", String(payload.discountPrice));
formData.append("stock", String(payload.stock));

payload.sizes.forEach((size) => {
  formData.append("sizes", size);
});

payload.colors.forEach((color) => {
  formData.append("colors", color);
});

        editNewImages.forEach((image) => formData.append("images", image));

        const existingImages = getProductImages(selectedProduct);
        removedImageIndexes
          .map((index) => existingImages[index])
          .map((image) => typeof image === "object"
            ? image?._id || image?.id || image?.public_id || image?.url
            : image)
          .filter(Boolean)
          .forEach((value) => formData.append("removeImages", value));

        requestOptions = {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        };
      } else {
        requestOptions = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        };
      }

      const response = await fetch(`${API_URL}/api/products/${id}`, requestOptions);

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }



      if (response.status === 401) {

        logout();

        return;

      }



      if (!response.ok) {

        throw new Error(data.message || "Product could not be updated.");

      }



      const returned = data?.product || data?.data || data?.item || {};

      const updatedProduct = {

        ...selectedProduct,

        ...payload,

        ...returned,

      };



      setSelectedProduct(updatedProduct);

      setAdminProducts((prev) =>

        prev.map((item) =>

          String(getProductId(item)) === String(id)

            ? { ...item, ...updatedProduct }

            : item,

        ),

      );

      setEditMode(false);

      toast.success("Product updated successfully!");

      fetchProducts(currentPage);

    } catch (error) {

      console.error(error);

      toast.error(error.message || "Something went wrong while updating product.");

    } finally {

      setEditLoading(false);

    }

  };



  const toggleProductStatus = async () => {

    const id = getProductId(selectedProduct);

    const token = localStorage.getItem("adminToken");



    if (!id || !token) {

      toast.error("Admin session not found. Please login again.");

      navigate("/admin-login");

      return;

    }



    const nextStatus = !isProductActive(selectedProduct);



    try {

      setStatusLoading(true);

      const response = await fetch(`${API_URL}/api/products/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: nextStatus }),
      });

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }



      if (response.status === 401) {

        logout();

        return;

      }



      if (!response.ok) {

        throw new Error(data.message || "Product status could not be changed.");

      }



      const returned = data?.product || data?.data || data?.item || {};

      const updatedProduct = {

        ...selectedProduct,

        ...returned,

        isActive: returned?.isActive ?? nextStatus,

      };



      setSelectedProduct(updatedProduct);

      setAdminProducts((prev) =>

        prev.map((item) =>

          String(getProductId(item)) === String(id)

            ? { ...item, isActive: updatedProduct.isActive }

            : item,

        ),

      );



      toast.success(

        updatedProduct.isActive

          ? "Product activated. Customers can see it now."

          : "Product deactivated. Customers can no longer see it.",

      );

      fetchProducts(currentPage);

    } catch (error) {

      console.error(error);

      toast.error(error.message || "Unable to change product status.");

    } finally {

      setStatusLoading(false);

    }

  };



  const addProduct = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    if (!token) {

      toast.error("Admin session not found. Please login again.");

      navigate("/admin-login");

      return;

    }

    if (

      !product.name.trim() ||

      !product.sku.trim() ||

      !product.category ||

      !product.price ||

      !product.stock

    ) {

      toast.error("Please fill all required fields.");

      return;

    }

    if (product.category === "OTHER" && !product.otherCategory.trim()) {

      toast.error("Please enter your custom category.");

      return;

    }

    if (!selectedImages.length) {

      toast.error("Please select at least one product image.");

      return;

    }



    try {

      setLoading(true);

      const formData = new FormData();

      const category =

        product.category === "OTHER"

          ? product.otherCategory.trim()

          : product.category;

      formData.append("name", product.name.trim());

      formData.append("sku", product.sku.trim());

      formData.append("category", category);

      formData.append("description", product.description.trim());

      formData.append("price", product.price);

      formData.append("discountPrice", product.discountPrice || "0");

      formData.append("stock", product.stock);

      formData.append(

        "sizes",

        product.sizes

          .split(",")

          .map((x) => x.trim())

          .filter(Boolean)

          .join(","),

      );

      formData.append(

        "colors",

        product.colors

          .split(",")

          .map((x) => x.trim())

          .filter(Boolean)

          .join(","),

      );

      selectedImages.forEach((image) => formData.append("images", image));



      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }

      if (response.status === 401) {

        logout();

        return;

      }

      if (!response.ok)

        throw new Error(data.message || "Product could not be added.");



      toast.success("Product added successfully!");

      setProduct(EMPTY_PRODUCT);

      resetImages();

      setActivePage("products");

      setCurrentPage(1);

      setTimeout(() => fetchProducts(1), 300);

    } catch (error) {

      toast.error(

        error.message || "Something went wrong while adding product.",

      );

    } finally {

      setLoading(false);

    }

  };



  const inStock = adminProducts.filter((x) => Number(x.stock) > 0).length;

  const outOfStock = adminProducts.filter((x) => Number(x.stock) <= 0).length;

  const categories = new Set(

    adminProducts.map((x) => String(x.category || "").trim()).filter(Boolean),

  ).size;

  const pageNumbers = Array.from(

    { length: Math.min(totalPages, 5) },

    (_, i) => Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i,

  ).filter((x) => x >= 1 && x <= totalPages);



  const stats = [

    [

      "Total Products",

      totalProducts || adminProducts.length,

      "Products in your store",

      ShoppingBag,

      "gold",

    ],

    ["In Stock", inStock, "Available on this page", CheckCircle2, "green"],

    ["Out of Stock", outOfStock, "Needs restocking", AlertCircle, "red"],

    ["Categories", categories, "Categories on this page", FolderKanban, "blue"],

  ];



  return (

    <section className="admin-dashboard">

      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <div className="sidebar-brand">

          <div className="sidebar-brand-icon">

            <ShieldCheck size={22} />

          </div>

          <div>

            <h2>Furniro</h2>

            <span>Admin Panel</span>

          </div>

        </div>

        <div className="sidebar-label">E-COMMERCE</div>

        <nav className="admin-nav">

          <button

            className={`admin-nav-item ${activePage === "dashboard" ? "active" : ""}`}

            onClick={() => go("dashboard")}

          >

            <LayoutDashboard size={18} />

            Dashboard

          </button>

          <button

            className={`admin-nav-item ${activePage === "products" ? "active" : ""}`}

            onClick={() => go("products")}

          >

            <ShoppingBag size={18} />

            Product List

          </button>

          <button

            className={`admin-nav-item ${activePage === "add" ? "active" : ""}`}

            onClick={() => go("add")}

          >

            <PackagePlus size={18} />

            Add Product

          </button>

          <button

            className="admin-nav-item"

            onClick={() =>

              toast.info(

                "Order List will be connected when order API is available.",

              )

            }

          >

            <Boxes size={18} />

            Order List

          </button>

          <button

            className="admin-nav-item"

            onClick={() =>

              toast.info(

                "Order Detail will be connected when order API is available.",

              )

            }

          >

            <Package size={18} />

            Order Detail

          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="online">

            <span />

            Admin Online

          </div>

          <button className="sidebar-logout" onClick={logout}>

            <LogOut size={17} />

            Logout

          </button>

        </div>

      </aside>



      {sidebarOpen && (

        <button

          className="sidebar-overlay"

          aria-label="Close sidebar"

          onClick={() => setSidebarOpen(false)}

        />

      )}



      <main className="admin-main">

        <header className="admin-header">

          <button

            className="mobile-menu-btn"

            onClick={() => setSidebarOpen(true)}

          >

            <LayoutDashboard size={20} />

          </button>

          <div className="header-title">

            <span>Furniro Administration</span>

            <strong>

              {activePage === "add"

                ? "Add Product"

                : activePage === "dashboard"

                  ? "Dashboard"

                  : "Products"}

            </strong>

          </div>

          <div className="header-right">

            <div className="header-online">

              <span />

              Online

            </div>

            <button className="header-logout" onClick={logout}>

              <LogOut size={16} />

              Logout

            </button>

          </div>

        </header>



        <div className="admin-content">

          {activePage === "add" ? (

            <>

              <div className="page-heading">

                <div>

                  <h1>Add Product</h1>

                  <p>Add a new product to your Furniro store.</p>

                </div>

                <button

                  className="secondary-btn"

                  onClick={() => go("products")}

                >

                  <ChevronLeft size={17} />

                  Back to Products

                </button>

              </div>

              <div className="add-card">

                <div className="add-card-header">

                  <div className="add-icon">

                    <PackagePlus size={22} />

                  </div>

                  <div>

                    <h2>Product Details</h2>

                    <p>Enter the product information below.</p>

                  </div>

                </div>

                <form className="product-form" onSubmit={addProduct}>

                  <div className="form-group">

                    <label>Product Name *</label>

                    <input

                      name="name"

                      value={product.name}

                      onChange={handleChange}

                      placeholder="Example: Wooden Chair"

                    />

                  </div>

                  <div className="form-group">

                    <label>SKU *</label>

                    <input

                      name="sku"

                      value={product.sku}

                      onChange={handleChange}

                      placeholder="Example: WC001"

                    />

                  </div>

                  <div className="form-group">

                    <label>Category *</label>

                    <select

                      name="category"

                      value={product.category}

                      onChange={handleChange}

                      required

                    >

                      <option value="">Select Category</option>

                      <option>SOFAS</option>

                      <option>CHAIRS</option>

                      <option>TABLES</option>

                      <option>BEDS</option>

                      <option>STORAGE</option>

                      <option>LIGHTING</option>

                      <option>DECOR</option>

                      <option>OTHER</option>

                    </select>

                  </div>

                  {product.category === "OTHER" && (

                    <div className="form-group">

                      <label>Other Category *</label>

                      <input

                        name="otherCategory"

                        value={product.otherCategory}

                        onChange={handleChange}

                        placeholder="Enter your custom category"

                      />

                    </div>

                  )}

                  <div className="form-group">

                    <label>Price *</label>

                    <input

                      type="number"

                      min="0"

                      name="price"

                      value={product.price}

                      onChange={handleChange}

                      placeholder="Example: 6500"

                    />

                  </div>

                  <div className="form-group">

                    <label>Discount Price</label>

                    <input

                      type="number"

                      min="0"

                      name="discountPrice"

                      value={product.discountPrice}

                      onChange={handleChange}

                      placeholder="Example: 5999"

                    />

                  </div>

                  <div className="form-group">

                    <label>Stock *</label>

                    <input

                      type="number"

                      min="0"

                      name="stock"

                      value={product.stock}

                      onChange={handleChange}

                      placeholder="Example: 10"

                    />

                  </div>

                  <div className="form-group">

                    <label>Sizes</label>

                    <input

                      name="sizes"

                      value={product.sizes}

                      onChange={handleChange}

                      placeholder="S, M, L, XL"

                    />

                  </div>

                  <div className="form-group">

                    <label>Colors</label>

                    <input

                      name="colors"

                      value={product.colors}

                      onChange={handleChange}

                      placeholder="Black, White"

                    />

                  </div>

                  <div className="form-group full">

                    <label>Description</label>

                    <textarea

                      name="description"

                      value={product.description}

                      onChange={handleChange}

                      rows="5"

                      placeholder="Enter product description..."

                    />

                  </div>

                  <div className="form-group full">

                    <label>Product Images *</label>

                    <div className="upload-box">

                      <input

                        id="product-images"

                        className="image-file-input"

                        type="file"

                        accept="image/*"

                        multiple

                        onChange={handleImageChange}

                      />

                      <label htmlFor="product-images" className="upload-label">

                        <ImagePlus size={27} />

                        <span>Choose Product Images</span>

                        <small>JPG, PNG, WEBP — Maximum 5 images</small>

                      </label>

                    </div>

                    {imagePreviews.length > 0 && (

                      <div className="preview-grid">

                        {imagePreviews.map((p, i) => (

                          <div className="preview-card" key={p.url}>

                            <img src={p.url} alt={`Preview ${i + 1}`} />

                            <button

                              type="button"

                              onClick={() => removeImage(i)}

                            >

                              <X size={14} />

                            </button>

                          </div>

                        ))}

                      </div>

                    )}

                    <small className="image-count">

                      {selectedImages.length} / 5 images selected

                    </small>

                  </div>

                  <div className="form-submit">

                    <button disabled={loading}>

                      {loading ? (

                        <>

                          <LoaderCircle size={17} className="spin" />

                          Adding Product...

                        </>

                      ) : (

                        <>

                          <PackagePlus size={17} />

                          Add Product

                        </>

                      )}

                    </button>

                  </div>

                </form>

              </div>

            </>

          ) : (

            <>

              <div className="page-heading">

                <div>

                  <h1>

                    {activePage === "dashboard" ? "Dashboard" : "Products"}

                  </h1>

                  <p>

                    {activePage === "dashboard"

                      ? "Welcome to your Furniro administration panel."

                      : "Manage your Furniro product inventory."}

                  </p>

                </div>

                <button className="add-btn" onClick={() => go("add")}>

                  <Plus size={17} />

                  Add Product

                </button>

              </div>

              <div className="stats-grid">

                {stats.map(([title, value, text, Icon, color]) => (

                  <div className="stat-card" key={title}>

                    <div>

                      <span>{title}</span>

                      <strong>{value}</strong>

                      <small>{text}</small>

                    </div>

                    <div className={`stat-icon ${color}`}>

                      <Icon size={20} />

                    </div>

                  </div>

                ))}

              </div>



              {activePage === "dashboard" ? (

                <div className="welcome-card">

                  <div>

                    <span>STORE OVERVIEW</span>

                    <h2>Manage your products from one place.</h2>

                    <p>

                      Use the Product List to search, review stock and manage

                      your Furniro inventory.

                    </p>

                  </div>

                  <button onClick={() => go("products")}>

                    <ShoppingBag size={17} />

                    View Products

                  </button>

                </div>

              ) : (

                <div className="product-card">

                  <div className="toolbar">

                    <div>

                      <h2>Product List</h2>

                      <p>View and manage all available products.</p>

                    </div>

                    <div className="toolbar-actions">

                      <div className="search-box">

                        <Search size={17} />

                        <input

                          value={searchTerm}

                          onChange={(e) => setSearchTerm(e.target.value)}

                          placeholder="Search products..."

                        />

                      </div>

                      <button

                        className="refresh-btn"

                        onClick={() => fetchProducts(currentPage)}

                        disabled={productsLoading}

                      >

                        <RefreshCw

                          size={17}

                          className={productsLoading ? "spin" : ""}

                        />

                      </button>

                    </div>

                  </div>

                  <div className="table-wrap">

                    <table>

                      <thead>

                        <tr>

                          <th>Product</th>

                          <th>Price</th>

                          <th>Category</th>

                          <th>Stock</th>

                          <th>SKU</th>

                          <th>Rating</th>

                          <th>Status</th>

                          <th></th>

                        </tr>

                      </thead>

                      <tbody>

                        {productsLoading ? (

                          <tr>

                            <td colSpan="8">

                              <div className="table-state">

                                <LoaderCircle size={28} className="spin" />

                                <span>Loading products...</span>

                              </div>

                            </td>

                          </tr>

                        ) : filteredProducts.length === 0 ? (

                          <tr>

                            <td colSpan="8">

                              <div className="table-state">

                                <Package size={30} />

                                <span>

                                  {searchTerm

                                    ? "No matching products found."

                                    : "No products found."}

                                </span>

                              </div>

                            </td>

                          </tr>

                        ) : (

                          filteredProducts.map((item, index) => {

                            const image = getImage(item);

                            const stock = Number(item.stock || 0);

                            const rating =

                              item.rating ??

                              item.averageRating ??

                              item.ratings?.average ??

                              "—";

                            const price = Number(

                              item.discountPrice || item.price || 0,

                            );

                            return (

                              <tr

                                key={item._id || item.id || item.sku || index}

                                className="product-row-clickable"

                                onClick={() => openProductDetails(item)}

                              >

                                <td>

                                  <div className="table-product">

                                    <div className="table-image">

                                      {image ? (

                                        <img

                                          src={image}

                                          alt={item.name || "Product"}

                                        />

                                      ) : (

                                        <Package size={21} />

                                      )}

                                    </div>

                                    <div>

                                      <strong>

                                        {item.name || "Unnamed Product"}

                                      </strong>

                                      <span>

                                        {item.description

                                          ? item.description.slice(0, 45)

                                          : "Furniro product"}

                                      </span>

                                    </div>

                                  </div>

                                </td>

                                <td className="price">

                                  ₹{price.toLocaleString("en-IN")}

                                </td>

                                <td>

                                  <span className="category-badge">

                                    {item.category || "—"}

                                  </span>

                                </td>

                                <td>

                                  <span

                                    className={

                                      stock > 0 ? "stock" : "stock zero"

                                    }

                                  >

                                    {stock}

                                  </span>

                                </td>

                                <td className="sku">{item.sku || "—"}</td>

                                <td className="rating">★ {rating}</td>

                                <td>

                                  <span

                                    className={

                                      isProductActive(item)

                                        ? "status active-status"

                                        : "status out-status"

                                    }

                                  >

                                    {isProductActive(item) ? "Active" : "Deactive"}

                                  </span>

                                </td>

                                <td>

                                  <button

                                    className="more-btn"

                                    title="View product details"

                                    onClick={(e) => {

                                      e.stopPropagation();

                                      openProductDetails(item);

                                    }}

                                  >

                                    <MoreHorizontal size={18} />

                                  </button>

                                </td>

                              </tr>

                            );

                          })

                        )}

                      </tbody>

                    </table>

                  </div>

                  <div className="table-footer">

                    <div className="rows">

                      <span>Rows per page</span>

                      <select

                        value={productsPerPage}

                        onChange={(e) => {

                          setProductsPerPage(Number(e.target.value));

                          setCurrentPage(1);

                        }}

                      >

                        <option value="10">10</option>

                        <option value="20">20</option>

                        <option value="30">30</option>

                      </select>

                    </div>

                    <span className="range">

                      {totalProducts

                        ? `${Math.min((currentPage - 1) * productsPerPage + 1, totalProducts)} - ${Math.min(currentPage * productsPerPage, totalProducts)} of ${totalProducts}`

                        : "0 products"}

                    </span>

                    <div className="pagination">

                      <button

                        disabled={currentPage === 1 || productsLoading}

                        onClick={() => setCurrentPage((p) => p - 1)}

                      >

                        <ChevronLeft size={15} />

                        Previous

                      </button>

                      {pageNumbers.map((p) => (

                        <button

                          key={p}

                          className={p === currentPage ? "current" : ""}

                          onClick={() => setCurrentPage(p)}

                        >

                          {p}

                        </button>

                      ))}

                      <button

                        disabled={currentPage === totalPages || productsLoading}

                        onClick={() => setCurrentPage((p) => p + 1)}

                      >

                        Next

                        <ChevronRight size={15} />

                      </button>

                    </div>

                  </div>

                </div>

              )}

            </>

          )}

        </div>

      </main>



      {selectedProduct && (

        <div className="product-modal-backdrop" onClick={closeProductDetails}>

          <div

            className="product-modal"

            role="dialog"

            aria-modal="true"

            aria-labelledby="product-details-title"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="product-modal-header">

              <div>

                <span className="modal-eyebrow">PRODUCT DETAILS</span>

                <h2 id="product-details-title">

                  {selectedProduct.name || "Product Details"}

                </h2>

              </div>

              <button

                className="modal-close-btn"

                onClick={closeProductDetails}

                aria-label="Close product details"

              >

                <X size={19} />

              </button>

            </div>



            {detailsLoading ? (

              <div className="product-modal-loading">

                <LoaderCircle size={30} className="spin" />

                <span>Loading product details...</span>

              </div>

            ) : (

              <>

                {detailsError && (

                  <div className="modal-warning">

                    {detailsError} Showing the available product data instead.

                  </div>

                )}



                <div className="product-modal-body">

                  <div className="product-modal-top">

                    <div className="modal-main-image">

                      {getImage(selectedProduct) ? (

                        <img

                          src={getImage(selectedProduct)}

                          alt={selectedProduct.name || "Product"}

                        />

                      ) : (

                        <Package size={48} />

                      )}

                    </div>



                    <div className="modal-summary">

                      <div className="modal-summary-title-row">

                        <div>

                          <h3>{selectedProduct.name || "Unnamed Product"}</h3>

                          <p>{selectedProduct.description || "No description available."}</p>

                        </div>

                        <span

                          className={`status ${

                            isProductActive(selectedProduct)

                              ? "active-status"

                              : "out-status"

                          }`}

                        >

                          {isProductActive(selectedProduct) ? "Active" : "Deactive"}

                        </span>

                      </div>



                      <div className="modal-info-grid">

                        <div>

                          <span>Price</span>

                          <strong>

                            ₹{Number(selectedProduct.price || 0).toLocaleString("en-IN")}

                          </strong>

                        </div>

                        <div>

                          <span>Discount Price</span>

                          <strong>

                            ₹{Number(selectedProduct.discountPrice || 0).toLocaleString("en-IN")}

                          </strong>

                        </div>

                        <div>

                          <span>Category</span>

                          <strong>{selectedProduct.category || "—"}</strong>

                        </div>

                        <div>

                          <span>Stock</span>

                          <strong>{Number(selectedProduct.stock || 0)}</strong>

                        </div>

                        <div>

                          <span>SKU</span>

                          <strong>{selectedProduct.sku || "—"}</strong>

                        </div>

                        <div>

                          <span>Rating</span>

                          <strong>

                            ★ {selectedProduct.rating ?? selectedProduct.averageRating ?? selectedProduct.ratings?.average ?? "—"}

                          </strong>

                        </div>

                      </div>

                    </div>

                  </div>



                  {!editMode ? (

                    <div className="modal-extra-grid">

                      <div className="modal-extra-card">

                        <span>Description</span>

                        <p>{selectedProduct.description || "No description available."}</p>

                      </div>

                      <div className="modal-extra-card">

                        <span>Sizes</span>

                        <p>{normalizeListField(selectedProduct.sizes) || "—"}</p>

                      </div>

                      <div className="modal-extra-card">

                        <span>Colors</span>

                        <p>{normalizeListField(selectedProduct.colors) || "—"}</p>

                      </div>

                    </div>

                  ) : (
                    <>
                    <div className="edit-images-section">
                      <div className="edit-images-header">
                        <div>
                          <h3>Product Images</h3>
                          <p>Remove old images or add new images.</p>
                        </div>
                        <label className="image-add-btn" htmlFor="edit-product-images">
                          <ImagePlus size={16} /> Add Images
                        </label>
                        <input id="edit-product-images" type="file" accept="image/*" multiple hidden onChange={handleEditImageChange} />
                      </div>

                      <div className="edit-image-grid">
                        {getProductImages(selectedProduct).map((image, index) => {
                          const imageUrl = getImageUrl(image);
                          const removed = removedImageIndexes.includes(index);
                          if (!imageUrl) return null;
                          return (
                            <div className={`edit-image-card ${removed ? "removed" : ""}`} key={`existing-${index}-${imageUrl}`}>
                              <img src={imageUrl} alt={`Product ${index + 1}`} />
                              {removed ? (
                                <button type="button" className="restore-image-btn" onClick={() => restoreExistingEditImage(index)}>Restore</button>
                              ) : (
                                <button type="button" className="delete-image-btn" onClick={() => removeExistingEditImage(index)}><X size={15} /> Delete</button>
                              )}
                            </div>
                          );
                        })}

                        {editNewImagePreviews.map((preview, index) => (
                          <div className="edit-image-card new-image" key={preview.url}>
                            <img src={preview.url} alt={`New image ${index + 1}`} />
                            <span className="new-image-badge">NEW</span>
                            <button type="button" className="delete-image-btn" onClick={() => removeNewEditImage(index)}><X size={15} /> Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <form className="modal-edit-form" onSubmit={updateProduct}>

                      <div className="modal-edit-grid">

                        <label>

                          Product Name

                          <input name="name" value={editForm.name} onChange={handleEditChange} />

                        </label>

                        <label>

                          SKU

                          <input name="sku" value={editForm.sku} onChange={handleEditChange} />

                        </label>

                        <label>

                          Category

                          <input name="category" value={editForm.category} onChange={handleEditChange} />

                        </label>

                        <label>

                          Price

                          <input type="number" min="0" name="price" value={editForm.price} onChange={handleEditChange} />

                        </label>

                        <label>

                          Discount Price

                          <input type="number" min="0" name="discountPrice" value={editForm.discountPrice} onChange={handleEditChange} />

                        </label>

                        <label>

                          Stock

                          <input type="number" min="0" name="stock" value={editForm.stock} onChange={handleEditChange} />

                        </label>

                        <label>

                          Sizes

                          <input name="sizes" value={editForm.sizes} onChange={handleEditChange} placeholder="S, M, L" />

                        </label>

                        <label>

                          Colors

                          <input name="colors" value={editForm.colors} onChange={handleEditChange} placeholder="Black, Gold" />

                        </label>

                        <label className="modal-edit-full">

                          Description

                          <textarea name="description" value={editForm.description} onChange={handleEditChange} rows="4" />

                        </label>

                      </div>

                      <div className="modal-edit-actions">

                        <button

                          type="button"

                          className="secondary-btn"

                          onClick={() => setEditMode(false)}

                          disabled={editLoading}

                        >

                          Cancel

                        </button>

                        <button type="submit" className="modal-primary-btn" disabled={editLoading}>

                          {editLoading ? <LoaderCircle size={16} className="spin" /> : <Save size={16} />}

                          {editLoading ? "Saving..." : "Save Changes"}

                        </button>

                      </div>

                    </form>
                    </>
                  )}

                </div>



                {!editMode && (

                  <div className="product-modal-footer">

                    <button

                      className={`status-action-btn ${

                        isProductActive(selectedProduct) ? "deactivate-btn" : "activate-btn"

                      }`}

                      onClick={toggleProductStatus}

                      disabled={statusLoading}

                    >

                      {statusLoading ? (

                        <LoaderCircle size={16} className="spin" />

                      ) : (

                        <Power size={16} />

                      )}

                      {statusLoading

                        ? "Updating..."

                        : isProductActive(selectedProduct)

                          ? "Deactivate Product"

                          : "Activate Product"}

                    </button>

                    <div className="modal-footer-right">

                      <button

                        className="modal-edit-btn"

                        onClick={() => setEditMode(true)}

                      >

                        <Pencil size={16} />

                        Edit Product

                      </button>

                      <button className="secondary-btn" onClick={closeProductDetails}>

                        Close

                      </button>

                    </div>

                  </div>

                )}

              </>

            )}

          </div>

        </div>

      )}

    </section>

  );

};



export default Admin;
