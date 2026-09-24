import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);


  // Add product to cart
  const addToCart = (product) => {

    setCartItems((previousItems) => {

      const existingProduct = previousItems.find(
        (item) => item.id === product.id
      );


      // Product already exists
      if (existingProduct) {

        return previousItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );

      }


      // New product
      return [
        ...previousItems,
        {
          ...product,
          quantity: 1,
        },
      ];

    });

  };


  // Increase quantity
  const increaseQuantity = (id) => {

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

  };


  // Decrease quantity
  const decreaseQuantity = (id) => {

    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  };


  // Remove product
  const removeFromCart = (id) => {

    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => item.id !== id
      )
    );

  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


// Custom hook
export const useCart = () => {
  return useContext(CartContext);
};