import React from "react";

const ProductCard = ({ name, price, image }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg text-center bg-white">
      <div className="h-60 flex items-center justify-center text-gray-500 text-lg font-semibold">
        <img src={image} alt={name} className="w-70 h-auto" />
      </div>
      <h3 className="mt-4 font-semibold text-lg">{name}</h3>
      <p className="text-gray-600 text-lg mt-1">{price}</p>
      <button className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg w-full text-lg font-medium hover:bg-gray-700">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
