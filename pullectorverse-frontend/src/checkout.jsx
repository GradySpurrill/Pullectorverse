import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useCart } from "./components/cartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [user, setUser] = useState(null);

  const {
    isAuthenticated,
    getAccessTokenSilently,
    user: auth0User,
  } = useAuth0();
  const customAudience = import.meta.env.VITE_AUTH0_AUDIENCE;

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated || !auth0User) {
        console.warn("User is not authenticated.");
        return;
      }

      try {
        console.log("Fetching fresh Auth0 token...");
        const token = await getAccessTokenSilently({
          audience: customAudience,
        });

        console.log("Auth0 Token Retrieved:", token);

        const auth0Id = auth0User.sub;
        console.log("Auth0 User ID:", auth0Id);

        if (!auth0Id) {
          console.error("No Auth0 ID found.");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/users/${auth0Id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Successfully Fetched User:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error(
          "Error Fetching User:",
          err.response?.data || err.message
        );
      }
    };

    fetchUser();
  }, [isAuthenticated, auth0User, getAccessTokenSilently, customAudience]);

  const subtotal = cartItems.reduce((sum, item) => {
    const productPrice = item?.productId?.price ?? 0;
    return sum + productPrice * item.quantity;
  }, 0);

  const shipping = 10.0;
  const taxes = subtotal * 0.05;
  const total = subtotal + shipping + taxes;

  const handlePayment = async () => {
    console.log("User Object Before Payment:", user);

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (!user) {
      console.warn("No user found, defaulting to guest!");
    }

    const userId = user?.auth0_id || "guest";
    const token = await getAccessTokenSilently({ audience: customAudience });

    console.log("🔹 Sending Token to Backend:", token);

    const paymentData = {
      items: cartItems.map(({ productId, quantity }) => ({
        id: productId?._id,
        name: productId?.name,
        price: productId?.price,
        quantity,
      })),
      total,
      email: user?.email || "guest@example.com",
      userId,
    };

    console.log("Sending to Backend:", paymentData);

    try {
      let endpoint =
        paymentMethod === "stripe"
          ? "http://localhost:5000/api/payments/stripe"
          : "http://localhost:5000/api/payments/paypal";

      const res = await axios.post(endpoint, paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
