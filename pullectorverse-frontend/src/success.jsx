import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful! 🎉</h1>
        <p className="text-gray-700 mb-6">Thank you for your order. Your payment has been processed successfully.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
          Return to Shop
        </Link>
      </div>
    </div>
  );
};

export default Success;
