import React, { useState } from "react";
import { useCart } from "./components/cartContext"; 
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateItemQuantity, removeItemFromCart, clearCart } = useCart();

  const [isClicked, setIsClicked] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        Your cart is empty.
        <br />
        <Link
          to="/shop"
          className="mt-4 inline-block px-6 py-3 bg-cyan-900 text-white rounded-md text-lg font-medium"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const productPrice = item.productId?.price ?? 0;
    return sum + productPrice * item.quantity;
  }, 0);

  const shipping = 10.0; 
  const taxes = subtotal * 0.05; 
  const total = subtotal + shipping + taxes;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);


  const navigate = useNavigate(); 

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex justify-center mb-6">
        <img src="PVLOGOBASEV3.png" alt="Pullectorverse Logo" className="h-16" />
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h1>
      <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Product</th>
            <th className="p-3 border">Availability</th>
            <th className="p-3 border">Qty</th>
            <th className="p-3 border">Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(({ productId, quantity }) => (
            <tr key={productId?._id} className="border">
              <td className="p-3 flex items-center gap-4 border">
                <img
                  src={productId?.images?.[0] || ""}
                  alt={productId?.name || "Product"}
                  className="h-20 w-20 object-cover rounded-md"
                />
                <span>{productId?.name || "Unknown"}</span>
              </td>
              <td className="p-3 border text-green-600 font-semibold">
                In-Stock
              </td>
              <td className="p-3 border flex items-center gap-2">
                <button
                  onClick={() =>
                    updateItemQuantity(productId._id, Math.max(1, quantity - 1))
                  }
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => updateItemQuantity(productId._id, quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </td>
              <td className="p-3 border">
                $
                {((productId?.price ?? 0) * quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 p-4 border rounded-lg bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Shipping:</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Taxes (5%):</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button className="w-full py-3 bg-gray-800 text-white rounded-md text-lg font-medium">
          Pay With Card
        </button>
        <button className="w-full py-3 bg-gray-100 text-black rounded-md text-lg font-medium border">
          Google Pay
        </button>
        <button className="w-full py-3 bg-yellow-400 text-blue-800 rounded-md text-lg font-medium">
          Pay with PayPal
        </button>
        <button
        className="w-full py-3 bg-green-600 text-white rounded-md text-lg font-medium transition-transform transform"
        onClick={() => navigate("/checkout")} // Redirects to checkout page
        >
         Continue to Checkout
        </button>
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={clearCart}
          className="w-1/2 py-3 bg-red-600 text-white rounded-md text-lg font-medium"
        >
          Clear Cart
        </button>
        <Link
          to="/shop"
          className="w-1/2 text-center py-3 bg-cyan-900 text-white rounded-md text-lg font-medium"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
};

export default Cart;
