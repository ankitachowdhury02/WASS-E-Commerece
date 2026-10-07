import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

const WishlistContext = createContext();

const API_URL = "https://ecomm-qy13.onrender.com";


// =====================================================
// WISHLIST PROVIDER
// =====================================================

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);


  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };


  // =====================================================
  // GET PRODUCT IMAGE
  // =====================================================

  const getProductImage = (product) => {
    if (!product) {
      return "";
    }

    // images array
    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      if (firstImage?.url) {
        return firstImage.url;
      }

      if (firstImage?.src) {
        return firstImage.src;
      }
    }

    // single image
    if (product.image) {
      return product.image;
    }

    if (product.imageUrl) {
      return product.imageUrl;
    }

    return "";
  };


  // =====================================================
  // GET PRODUCT ID
  // =====================================================

  const getProductId = (item) => {
    if (!item) {
      return null;
    }

    // যদি সরাসরি number হয়
    if (
      typeof item === "number" ||
      typeof item === "string"
    ) {
      return item;
    }

    return (
      item.productId ||
      item.product_id ||
      item.product?.id ||
      item.product?._id ||
      item.product?.productId ||
      item.id ||
      item._id ||
      null
    );
  };


  // =====================================================
  // FIND WISHLIST ARRAY
  // =====================================================

  const findWishlistArray = (data) => {
    // Direct array
    if (Array.isArray(data)) {
      return data;
    }

    if (!data || typeof data !== "object") {
      return [];
    }


    // Most common response formats

    if (Array.isArray(data.wishlist)) {
      return data.wishlist;
    }

    if (Array.isArray(data.wishlistItems)) {
      return data.wishlistItems;
    }

    if (Array.isArray(data.items)) {
      return data.items;
    }

    if (Array.isArray(data.products)) {
      return data.products;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }


    // Nested data
    if (
      data.data &&
      typeof data.data === "object"
    ) {
      const nestedResult =
        findWishlistArray(data.data);

      if (nestedResult.length > 0) {
        return nestedResult;
      }
    }


    // Nested result
    if (
      data.result &&
      typeof data.result === "object"
    ) {
      const nestedResult =
        findWishlistArray(data.result);

      if (nestedResult.length > 0) {
        return nestedResult;
      }
    }


    // Search one level deeper
    for (const key of Object.keys(data)) {
      const value = data[key];

      if (
        value &&
        typeof value === "object"
      ) {
        const result =
          findWishlistArray(value);

        if (result.length > 0) {
          return result;
        }
      }
    }

    return [];
  };


  // =====================================================
  // GET PRODUCT DETAILS
  // =====================================================

  const fetchProductById = async (productId) => {
    if (!productId) {
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/products/${productId}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      console.log(
        `Product ${productId} Response:`,
        data
      );


      const product =
        data?.product ||
        data?.data?.product ||
        data?.data ||
        data;


      if (!product) {
        return null;
      }


      return product;

    } catch (error) {
      console.error(
        `Product ${productId} fetch error:`,
        error
      );

      return null;
    }
  };


  // =====================================================
  // NORMALIZE WISHLIST
  // =====================================================

  const normalizeWishlistItems = async (data) => {
    const items =
      findWishlistArray(data);


    console.log(
      "Extracted Wishlist Items:",
      items
    );


    if (!Array.isArray(items)) {
      return [];
    }


    const finalItems = [];


    for (const item of items) {

      // -----------------------------------------------
      // যদি item-এর মধ্যে product already থাকে
      // -----------------------------------------------

      if (
        item?.product &&
        typeof item.product === "object"
      ) {
        finalItems.push({
          ...item,

          product: item.product,

          productId:
            item.productId ||
            item.product.id ||
            item.product._id,

          image:
            getProductImage(item.product),

          name:
            item.product.name ||
            item.name ||
            "Product",

          price:
            item.product.discountPrice ??
            item.product.price ??
            item.price ??
            0,
        });

        continue;
      }


      // -----------------------------------------------
      // যদি item নিজেই product হয়
      // -----------------------------------------------

      const productId =
        getProductId(item);


      if (!productId) {
        continue;
      }


      // -----------------------------------------------
      // যদি item-এ product details থাকে
      // -----------------------------------------------

      const hasProductDetails =
        item?.name ||
        item?.title ||
        item?.price ||
        item?.images ||
        item?.image;


      if (hasProductDetails) {

        finalItems.push({
          ...item,

          productId:
            Number(productId),

          product: item,

          image:
            getProductImage(item),

          name:
            item.name ||
            item.title ||
            "Product",

          price:
            item.discountPrice ??
            item.price ??
            0,
        });

        continue;
      }


      // -----------------------------------------------
      // শুধুমাত্র productId থাকলে
      // product API থেকে details আনবো
      // -----------------------------------------------

      const product =
        await fetchProductById(
          productId
        );


      if (product) {

        finalItems.push({
          ...item,

          productId:
            Number(productId),

          product: product,

          image:
            getProductImage(product),

          name:
            product.name ||
            product.title ||
            "Product",

          price:
            product.discountPrice ??
            product.price ??
            0,
        });

      } else {

        // Product API না পেলেও wishlist item রাখবো

        finalItems.push({
          ...item,

          productId:
            Number(productId),

          product: null,

          image:
            getProductImage(item),

          name:
            item.name ||
            item.title ||
            "Product",

          price:
            item.discountPrice ??
            item.price ??
            0,
        });
      }
    }


    return finalItems;
  };


  // =====================================================
  // GET MY WISHLIST
  // GET /api/wishlist
  // =====================================================

  const fetchWishlist = async () => {
    const token = getToken();


    if (!token) {
      setWishlistItems([]);
      return;
    }


    try {
      setWishlistLoading(true);


      const response = await fetch(
        `${API_URL}/api/wishlist`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );


      const data =
        await response.json();


      console.log(
        "GET WISHLIST STATUS:",
        response.status
      );

      console.log(
        "GET WISHLIST RESPONSE:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch wishlist."
        );
      }


      // Normalize response
      const normalizedItems =
        await normalizeWishlistItems(
          data
        );


      console.log(
        "FINAL WISHLIST ITEMS:",
        normalizedItems
      );


      setWishlistItems(
        normalizedItems
      );

    } catch (error) {

      console.error(
        "GET WISHLIST ERROR:",
        error
      );

      setWishlistItems([]);

    } finally {

      setWishlistLoading(false);
    }
  };


  // =====================================================
  // ADD TO WISHLIST
  // POST /api/wishlist/:productId
  // =====================================================

  const addToWishlist = async (
    productId
  ) => {
    const token = getToken();


    if (!token) {
      toast.error(
        "Please login first"
      );

      return false;
    }


    if (!productId) {
      toast.error(
        "Product ID not found"
      );

      return false;
    }


    try {

      const response = await fetch(
        `${API_URL}/api/wishlist/${productId}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );


      const data =
        await response.json();


      console.log(
        "ADD WISHLIST STATUS:",
        response.status
      );

      console.log(
        "ADD WISHLIST RESPONSE:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data?.message ||
            "Failed to add product to wishlist"
        );
      }


      toast.success(
        "Added to wishlist"
      );


      // Latest wishlist load
      await fetchWishlist();


      return true;

    } catch (error) {

      console.error(
        "ADD WISHLIST ERROR:",
        error
      );


      toast.error(
        error.message ||
          "Something went wrong"
      );


      return false;
    }
  };


  // =====================================================
  // REMOVE FROM WISHLIST
  // DELETE /api/wishlist/:productId
  // =====================================================

  const removeFromWishlist = async (
    productId
  ) => {
    const token = getToken();


    if (!token) {
      toast.error(
        "Please login first"
      );

      return false;
    }


    if (!productId) {
      toast.error(
        "Product ID not found"
      );

      return false;
    }


    try {

      const response = await fetch(
        `${API_URL}/api/wishlist/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );


      let data = {};


      const text =
        await response.text();


      if (text) {

        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }


      console.log(
        "REMOVE WISHLIST STATUS:",
        response.status
      );

      console.log(
        "REMOVE WISHLIST RESPONSE:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data?.message ||
            "Failed to remove product from wishlist"
        );
      }


      toast.success(
        "Removed from wishlist"
      );


      // Latest wishlist load
      await fetchWishlist();


      return true;

    } catch (error) {

      console.error(
        "REMOVE WISHLIST ERROR:",
        error
      );


      toast.error(
        error.message ||
          "Something went wrong"
      );


      return false;
    }
  };


  // =====================================================
  // CHECK PRODUCT IN WISHLIST
  // =====================================================

  const isInWishlist = (
    productId
  ) => {

    if (!productId) {
      return false;
    }


    return wishlistItems.some(
      (item) => {

        const itemProductId =
          getProductId(item);


        return (
          Number(itemProductId) ===
          Number(productId)
        );
      }
    );
  };


  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    fetchWishlist();
  }, []);


  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,

        wishlistLoading,

        fetchWishlist,

        addToWishlist,

        removeFromWishlist,

        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};


// =====================================================
// CUSTOM HOOK
// =====================================================

export const useWishlist = () => {

  const context =
    useContext(WishlistContext);


  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }


  return context;
};