import { useEffect, useState } from "react";
import { useCart } from "./components/cartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
        try {
          const token = localStorage.getItem("auth0_token"); 
          if (!token) {
            console.error("User not logged in (no token found)");
            return;
          }
      
          const res = await axios.get(`http://localhost:5000/api/auth/${auth0_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          setUser(res.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      

    fetchUser();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => {
    const productPrice = item?.productId?.price ?? 0;
    return sum + productPrice * item.quantity;
  }, 0);

  const shipping = 10.0;
  const taxes = subtotal * 0.05;
  const total = subtotal + shipping + taxes;

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
  
    try {
      let endpoint =
        paymentMethod === "stripe"
          ? "http://localhost:5000/api/payments/stripe"
          : "http://localhost:5000/api/payments/paypal";
  
      const res = await axios.post(endpoint, {
        items: cartItems.map(({ productId, quantity }) => ({
          id: productId?._id,
          name: productId?.name,
          price: productId?.price,
          quantity,
        })),
        total,
        email: user?.email || "guest@example.com", 
      });
  
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed, please try again.");
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>

      <div className="mt-6 p-4 border rounded-lg bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping:</span>
          <span>${shipping.toFixed(2)}</span>
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

      <h2 className="text-xl font-bold mt-6">Select Payment Method</h2>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setPaymentMethod("stripe")}
          className={`w-full py-3 rounded-md text-lg font-medium border ${
            paymentMethod === "stripe"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          Pay with Credit Card (Stripe)
        </button>
        <button
          onClick={() => setPaymentMethod("paypal")}
          className={`w-full py-3 rounded-md text-lg font-medium border ${
            paymentMethod === "paypal"
              ? "bg-yellow-400 text-blue-800"
              : "bg-gray-100 text-black"
          }`}
        >
          Pay with PayPal
        </button>
      </div>

      <button
        className="mt-6 w-full py-3 bg-green-600 text-white rounded-md text-lg font-medium"
        onClick={handlePayment}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default Checkout;
