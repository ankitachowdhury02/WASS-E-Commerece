import React from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartSidebar.css";

const CartSidebar = ({ isOpen, onClose }) => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const getPrice = (price) => {
    if (typeof price === "number") {
      return price;
    }

    return (
      parseFloat(
        String(price || "0").replace(/[^0-9.]/g, "")
      ) || 0
    );
  };

  const formatPrice = (price) => {
    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  const total = cartItems.reduce((sum, item) => {
    const price = getPrice(item.price);

    return sum + price * item.quantity;
  }, 0);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Dark background */}
      <div
        className="cart-sidebar-overlay"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="cart-sidebar">

        {/* Header */}
        <div className="cart-sidebar-header">

          <h2>Shopping Cart</h2>

          <button
            type="button"
            className="cart-sidebar-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        {/* Products */}
        <div className="cart-sidebar-products">

          {cartItems.length === 0 ? (
            <div className="cart-sidebar-empty">
              <p>Your cart is empty.</p>

              <Link
                to="/shop"
                onClick={onClose}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const price = getPrice(item.price);

              return (
                <div
                  className="cart-sidebar-item"
                  key={
                    item.cartItemId || item.id
                  }
                >

                  {/* Image */}
                  <div className="cart-sidebar-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  {/* Details */}
                  <div className="cart-sidebar-details">

                    <h3>{item.name}</h3>

                    <p>
                      {formatPrice(price)}
                    </p>

                    <div className="cart-sidebar-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        <Minus size={13} />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        <Plus size={13} />
                      </button>

                    </div>

                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    className="cart-sidebar-delete"
                    onClick={() =>
                      removeFromCart(
                        item.cartItemId
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              );
            })
          )}

        </div>

        {/* Bottom */}
        {cartItems.length > 0 && (
          <div className="cart-sidebar-bottom">

            <div className="cart-sidebar-total">

              <span>Subtotal</span>

              <strong>
                {formatPrice(total)}
              </strong>

            </div>

            <div className="cart-sidebar-actions">

              <Link
                to="/cart"
                onClick={onClose}
              >
                Cart
              </Link>

              <Link
                to="/checkout"
                onClick={onClose}
              >
                Checkout
              </Link>

            </div>

          </div>
        )}

      </div>
    </>
  );
};

export default CartSidebar;