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
  // GET USER TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
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
    } else if (Array.isArray(data?.data?.items)) {
      items = data.data.items;
    } else if (Array.isArray(data?.data?.cart)) {
      items = data.data.cart;
    }

    return items.map((item) => {
      // Backend cart item may contain product object
      const product = item.product || item.productDetails || {};

      return {
        // IMPORTANT:
        // cartItemId = backend cart item's ID
        cartItemId:
          item.id ||
          item.cartItemId ||
          item._id ||
          item.cart_id ||
          null,

        // Product ID
        id:
          product.id ||
          product.productId ||
          product._id ||
          item.productId ||
          item.product?.id,

        productId:
          product.id ||
          product.productId ||
          product._id ||
          item.productId,

        name:
          product.name ||
          item.name ||
          "Product",

        category:
          product.category ||
          item.category ||
          "",

        image:
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : product.image ||
              item.image ||
              item.images?.[0] ||
              "",

        price:
          product.discountPrice ||
          product.price ||
          item.discountPrice ||
          item.price ||
          0,

        oldPrice:
          product.oldPrice ||
          item.oldPrice ||
          "",

        quantity:
          Number(item.quantity) > 0
            ? Number(item.quantity)
            : 1,

        // Keep original backend data
        ...item,
      };
    });
  };

  // =====================================================
  // GET MY CART
  // GET /api/cart
  // =====================================================

  const fetchCart = async () => {
    const token = getToken();

    // User not logged in
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setCartLoading(true);

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("GET CART STATUS:", response.status);
      console.log("GET CART RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load cart");
      }

      const normalizedItems = normalizeCartItems(data);

      setCartItems(normalizedItems);
    } catch (error) {
      console.error("GET CART ERROR:", error);

      setCartItems([]);

      if (error.message) {
        toast.error(error.message);
      }
    } finally {
      setCartLoading(false);
    }
  };

  // =====================================================
  // LOAD CART WHEN USER IS LOGGED IN
  // =====================================================

  useEffect(() => {
    fetchCart();
  }, []);

  // =====================================================
  // ADD PRODUCT TO CART
  // POST /api/cart
  // =====================================================

  const addToCart = async (product) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login first to add products to cart.");
      return;
    }

    if (!product?.id) {
      toast.error("Product ID is missing.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          productId: Number(product.id),
          quantity: 1,
        }),
      });

      const data = await response.json();

      console.log("ADD CART STATUS:", response.status);
      console.log("ADD CART RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product to cart");
      }

      // Reload cart from backend
      await fetchCart();

      toast.success(`${product.name} added to cart!`);

    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      toast.error(
        error.message || "Unable to add product to cart."
      );
    }
  };

  // =====================================================
  // UPDATE CART QUANTITY
  // PATCH /api/cart/:cartItemId
  // =====================================================

  const updateCartQuantity = async (cartItemId, quantity) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login first.");
      return false;
    }

    if (!cartItemId) {
      toast.error("Cart item ID is missing.");
      return false;
    }

    if (quantity < 1) {
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
          data.message || "Failed to update cart quantity"
        );
      }

      // Reload latest backend cart
      await fetchCart();

      return true;

    } catch (error) {
      console.error(
        "UPDATE CART QUANTITY ERROR:",
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
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = async (productId) => {
    const item = cartItems.find(
      (cartItem) =>
        cartItem.id === productId ||
        cartItem.productId === productId
    );

    if (!item) {
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
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find(
      (cartItem) =>
        cartItem.id === productId ||
        cartItem.productId === productId
    );

    if (!item) {
      return;
    }

    const cartItemId = item.cartItemId;

    const currentQuantity =
      Number(item.quantity) || 1;

    // Don't send quantity 0
    if (currentQuantity <= 1) {
      toast.info(
        "Quantity cannot be less than 1."
      );
      return;
    }

    await updateCartQuantity(
      cartItemId,
      currentQuantity - 1
    );
  };

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const removeFromCart = async (productId) => {
    /*
      IMPORTANT:

      Your current Postman collection does NOT show
      a DELETE /api/cart/:id endpoint.

      So we cannot safely invent a DELETE API.

      For now, remove the item from UI state only.
    */

    setCartItems((previousItems) =>
      previousItems.filter(
        (item) =>
          item.id !== productId &&
          item.productId !== productId
      )
    );

    toast.success("Product removed from cart.");
  };

  // =====================================================
  // CLEAR CART LOCAL STATE
  // =====================================================

  const clearCart = () => {
    setCartItems([]);
  };

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <CartContext.Provider
      value={{
        cartItems,

        cartLoading,

        addToCart,

        fetchCart,

        increaseQuantity,

        decreaseQuantity,

        updateCartQuantity,

        removeFromCart,

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
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};