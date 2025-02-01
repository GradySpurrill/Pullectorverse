import React, { useState } from "react";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const isSingleCard = product.category === "Ungraded Card";
  const isGradedCard = product.category === "Graded Card";

  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const imageStyle = product.category === "Booster Pack"
    ? { width: '130px', height: 'auto' }
    : product.category === "Ungraded Card"
    ? { width: '170px', height: 'auto' }
    : product.category === "Graded Card"
    ? { width: '150px', height: 'auto' } 
    : product.category === "Accessory"
    ? { width: '160px', height: 'auto' } 
    : product.category === "sealed"
    ? { width: '50px', height: 'auto' } 
    : { width: '150px', height: 'auto' };
    

  return (
    <div className="border p-4 rounded-lg shadow-lg text-center bg-white">
      <div className="h-60 flex items-center justify-center text-gray-500 text-lg font-semibold">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          style={imageStyle}
          className="h-auto object-contain" 
        />
      </div>

      {isSingleCard && (
        <div className="mt-2 flex justify-center gap-2">
          <span className="text-xs font-medium">{product.condition}</span>
          <span className="text-xs font-medium">{product.rarity}</span>
        </div>
      )}

{isGradedCard && (
  <div className="mt-2 flex justify-between px-3 text-sm font-medium text-black">
    <span>{product.gradingCompany || "N/A"}</span>
    <span>Grade: {product.grade || "N/A"}</span>
  </div>
)}


      <h3 className="mt-4 font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-lg mt-1">${product.price.toFixed(2)}</p>
      
      <div className="mt-4 flex items-center justify-between bg-gray-100 rounded-lg p-2">
        <span className="text-sm text-gray-600">
          In Stock: {product.stock}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleDecrement}
          className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-lg font-medium">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <button
        className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg w-full text-lg font-medium hover:bg-gray-700"
        onClick={() => console.log('Add to cart:', product._id, quantity)}
      >
        Add to Cart ({quantity})
      </button>
    </div>
  );
};

export default ProductCard;
