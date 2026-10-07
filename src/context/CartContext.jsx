import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

const API_URL = "https://ecomm-qy13.onrender.com";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // =====================================================
  // GET LOGIN TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // GET PRODUCT IMAGE
  // =====================================================

  const getProductImage = (product) => {
    if (!product) return "";

    if (Array.isArray(product.images) && product.images.length > 0) {
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

    return product.image || "";
  };

  // =====================================================
  // NORMALIZE CART RESPONSE
  // =====================================================

  const normalizeCartItems = (data) => {
    let items = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (Array.isArray(data?.cart)) {
      items = data.cart;
    } else if (Array.isArray(data?.items)) {
      items = data.items;
    } else if (Array.isArray(data?.data)) {
      items = data.data;
    } else if (Array.isArray(data?.data?.cart)) {
      items = data.data.cart;
    } else if (Array.isArray(data?.data?.items)) {
      items = data.data.items;
    }

    return items.map((item) => {
      const product =
        item.product ||
        item.productDetails ||
        item.productData ||
        {};

      // Product ID
      const productId =
        product.id ||
        product.productId ||
        product._id ||
        item.productId;

      // Cart Item ID
      const cartItemId =
        item.id ||
        item.cartItemId ||
        item._id ||
        item.cart_id;

      return {
        // Backend Cart Item ID
        cartItemId: cartItemId,

        // Product ID
        id: productId,
        productId: productId,

        // Product information
        name:
          product.name ||
          item.name ||
          "Product",

        category:
          product.category ||
          item.category ||
          "",

        description:
          product.description ||
          item.description ||
          "",

        // Product image
        image:
          getProductImage(product) ||
          getProductImage(item),

        // Product price
        price:
          product.discountPrice ??
          product.price ??
          item.discountPrice ??
          item.price ??
          0,

        // Old price
        oldPrice:
          product.oldPrice ||
          item.oldPrice ||
          "",

        // Quantity
        quantity:
          Number(item.quantity) > 0
            ? Number(item.quantity)
            : 1,

        // Keep backend data
        ...item,

        // Make sure these values remain available
        cartItemId: cartItemId,
        id: productId,
        productId: productId,

        name:
          product.name ||
          item.name ||
          "Product",

        image:
          getProductImage(product) ||
          getProductImage(item),

        price:
          product.discountPrice ??
          product.price ??
          item.discountPrice ??
          item.price ??
          0,

        quantity:
          Number(item.quantity) > 0
            ? Number(item.quantity)
            : 1,
      };
    });
  };

  // =====================================================
  // 1. GET CART
  // GET /api/cart
  // =====================================================

  const fetchCart = async () => {
    const token = getToken();

    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setCartLoading(true);

      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("GET CART STATUS:", response.status);
      console.log("GET CART RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load cart."
        );
      }

      const items = normalizeCartItems(data);

      setCartItems(items);
    } catch (error) {
      console.error("GET CART ERROR:", error);

      setCartItems([]);

      toast.error(
        error.message || "Unable to load cart."
      );
    } finally {
      setCartLoading(false);
    }
  };

  // =====================================================
  // LOAD CART WHEN PAGE LOADS
  // =====================================================

  useEffect(() => {
    fetchCart();
  }, []);

  // =====================================================
  // 2. ADD TO CART
  // POST /api/cart
  // =====================================================

  const addToCart = async (product) => {
    const token = getToken();

    if (!token) {
      toast.error(
        "Please login first to add products to cart."
      );

      return false;
    }

    const prodId = product?.id || product?.productId || product?._id;

    if (!prodId) {
      toast.error("Product ID is missing.");

      return false;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: Number(prodId),
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "ADD CART STATUS:",
        response.status
      );

      console.log(
        "ADD CART RESPONSE:",
        data
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please login again to continue.");
        }
        throw new Error(
          data.message ||
            "Failed to add product to cart."
        );
      }

      // Backend থেকে latest cart নিয়ে আসবে
      await fetchCart();

      const productName = product?.name || data?.product?.name || "Product";
      toast.success(
        data?.message || `${productName} added to cart!`
      );

      return true;
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Unable to add product to cart."
      );

      return false;
    }
  };

  // =====================================================
  // FIND CART ITEM
  // =====================================================

  const findCartItem = (productId) => {
    return cartItems.find(
      (item) =>
        String(item.id) === String(productId) ||
        String(item.productId) === String(productId)
    );
  };

  // =====================================================
  // 3. UPDATE CART QUANTITY
  // PATCH /api/cart/:cartItemId
  // =====================================================

  const updateCartQuantity = async (
    cartItemId,
    quantity
  ) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login first.");

      return false;
    }

    if (!cartItemId) {
      toast.error(
        "Cart item ID is missing."
      );

      return false;
    }

    if (Number(quantity) < 1) {
      return false;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart/${cartItemId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity: Number(quantity),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "UPDATE CART STATUS:",
        response.status
      );

      console.log(
        "UPDATE CART RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update cart quantity."
        );
      }

      // Latest cart load
      await fetchCart();

      return true;
    } catch (error) {
      console.error(
        "UPDATE CART ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Unable to update cart quantity."
      );

      return false;
    }
  };

  // =====================================================
  // 4. INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = async (productId) => {
    const item = findCartItem(productId);

    if (!item) {
      toast.error(
        "Cart item not found."
      );

      return;
    }

    const cartItemId = item.cartItemId;

    const currentQuantity =
      Number(item.quantity) || 1;

    await updateCartQuantity(
      cartItemId,
      currentQuantity + 1
    );
  };

  // =====================================================
  // 5. DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = async (productId) => {
    const item = findCartItem(productId);

    if (!item) {
      toast.error(
        "Cart item not found."
      );

      return;
    }

    const cartItemId = item.cartItemId;

    const currentQuantity =
      Number(item.quantity) || 1;

    // Quantity 1 এর নিচে যাবে না
    if (currentQuantity <= 1) {
      toast.info(
        "Minimum quantity is 1."
      );

      return;
    }

    await updateCartQuantity(
      cartItemId,
      currentQuantity - 1
    );
  };

  // =====================================================
  // 6. DELETE PRODUCT FROM CART
  // DELETE /api/cart/:cartItemId
  // =====================================================

  const removeFromCart = async (cartItemId) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login first.");

      return false;
    }

    if (!cartItemId) {
      toast.error(
        "Cart item ID is missing."
      );

      return false;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart/${cartItemId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // DELETE API empty response দিতে পারে
      let data = {};

      const text = await response.text();

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }

      console.log(
        "DELETE CART STATUS:",
        response.status
      );

      console.log(
        "DELETE CART RESPONSE:",
        data
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please login again to continue.");
        }
        throw new Error(
          data.message ||
            "Failed to remove product from cart."
        );
      }

      // Latest cart load
      await fetchCart();

      toast.success(
        data?.message || "Product removed from cart!"
      );

      return true;
    } catch (error) {
      console.error(
        "DELETE CART ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Unable to remove product from cart."
      );

      return false;
    }
  };

  // =====================================================
  // 7. CLEAR LOCAL CART
  // =====================================================

  const clearCart = () => {
    setCartItems([]);
  };

  // =====================================================
  // CONTEXT PROVIDER
  // =====================================================

  return (
    <CartContext.Provider
      value={{
        // Cart data
        cartItems,
        cartLoading,

        // GET API
        fetchCart,

        // POST API
        addToCart,

        // PATCH API
        updateCartQuantity,
        increaseQuantity,
        decreaseQuantity,

        // DELETE API
        removeFromCart,

        // Local clear
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }

  return context;
};