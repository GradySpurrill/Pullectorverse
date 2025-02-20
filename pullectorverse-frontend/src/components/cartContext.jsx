import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          withCredentials: true,
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  const addItemToCart = async (product, quantity) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity },
        { withCredentials: true }
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/${productId}`,
        { withCredentials: true }
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateItemQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems([]);
      console.log("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => {
  return useContext(CartContext);
};
