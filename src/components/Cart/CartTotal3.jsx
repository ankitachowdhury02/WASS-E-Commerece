import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import "./CartTotal3.css";

const CartTotal3 = () => {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();


  // Price string থেকে number
  const getPrice = (price) => {

    return Number(
      price
        .replace(/[^0-9]/g, "")
    );

  };


  // Total calculation
  const total = cartItems.reduce(
    (sum, item) => {

      const price = getPrice(item.price);

      return sum + price * item.quantity;

    },
    0
  );


  // Price format
  const formatPrice = (price) => {

    return `Rp ${price.toLocaleString("id-ID")}`;

  };


  return (
    <section className="cart-section">


      {/* LEFT SIDE */}
      <div className="cart-products">


        {/* Heading */}
        <div className="cart-heading">

          <p>Product</p>

          <p>Price</p>

          <p>Quantity</p>

          <p>Subtotal</p>

        </div>


        {/* Empty Cart */}
        {cartItems.length === 0 && (

          <div className="empty-cart">

            <h3>Your cart is empty</h3>

            <Link to="/shop">
              Continue Shopping
            </Link>

          </div>

        )}


        {/* Products */}
        {cartItems.map((item) => {

          const price = getPrice(item.price);

          const subtotal =
            price * item.quantity;


          return (

            <div
              className="cart-product"
              key={item.id}
            >


              {/* Image */}
              <div className="cart-product-image">

                <img
                  src={item.image}
                  alt={item.name}
                />

              </div>


              {/* Name */}
              <p className="cart-product-name">

                {item.name}

              </p>


              {/* Price */}
              <p className="cart-product-price">

                {formatPrice(price)}

              </p>


              {/* Quantity */}
              <div className="cart-quantity">

                <button
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
                  onClick={() =>
                    increaseQuantity(item.id)
                  }
                >
                  <Plus size={13} />
                </button>

              </div>


              {/* Subtotal */}
              <p className="cart-product-subtotal">

                {formatPrice(subtotal)}

              </p>


              {/* Delete */}
              <button
                className="delete-button"
                onClick={() =>
                  removeFromCart(item.id)
                }
              >

                <Trash2 size={18} />

              </button>


            </div>

          );

        })}


      </div>


      {/* RIGHT SIDE */}
      <div className="cart-total">

        <h2>
          Cart Totals
        </h2>


        <div className="cart-total-row">

          <p>Subtotal</p>

          <span>
            {formatPrice(total)}
          </span>

        </div>


        <div className="cart-total-row total">

          <p>Total</p>

          <strong>
            {formatPrice(total)}
          </strong>

        </div>


        <Link
          to="/checkout"
          className="checkout-button"
        >
          Check Out
        </Link>


      </div>


    </section>
  );
};

export default CartTotal3;