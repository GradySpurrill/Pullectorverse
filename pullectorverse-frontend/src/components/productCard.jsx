import React, { useState } from "react";
import Modal from "./productModal";
import { useCart } from "./cartContext";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addItemToCart } = useCart();

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const imageStyle =
    product.category === "Booster Pack"
      ? { width: "auto", height: "175px" }
      : product.category === "Ungraded Card"
      ? { width: "auto", height: "160px" }
      : product.category === "Graded Card"
      ? { width: "auto", height: "175px" }
      : product.category === "Accessory"
      ? { width: "auto", height: "175px" }
      : product.category === "Collection Box"
      ? { width: "auto", height: "175px" }
      : product.category === "Elite Trainer Box"
      ? { width: "auto", height: "175px" }
      : product.category === "Booster Bundle"
      ? { width: "auto", height: "175px" }
      : { width: "auto", height: "175px" };

  return (
    <div className="text-cyan-950 p-4 rounded-lg text-center bg-white w-[275px] h-[475px] flex flex-col justify-between">
      <div
        className="h-60 flex items-center justify-center text-gray-500 text-lg font-semibold cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          style={imageStyle}
          className="h-auto object-contain transform transition duration-300 ease-in-out hover:scale-105"
        />
      </div>

      <h3 className="mt-4 font-semibold text-medium">{product.name}</h3>
      

      {product.category === "Ungraded Card" && (
        <div className="mt-2 flex justify-center gap-2">
          <span className="text-xs font-medium">
            Condition: {product.condition}
          </span>
          <span className="text-xs font-medium">
            Rarity: {product.rarity}
          </span>
        </div>
      )}
      {product.category === "Graded Card" && (
        <div className="mt-2 flex justify-center gap-2">
          <span className="text-xs font-medium">
            Grading Company: {product.gradingCompany}
          </span>
          <span className="text-xs font-medium">Grade: {product.grade}</span>
        </div>
      )}
      {product.category === "Accessory" && (
        <div className="mt-2 flex justify-center gap-2">
          <span className="text-xs font-medium">
            Type: {product.accessoryType}
          </span>
          <span className="text-xs font-medium">
            {product.quantityPerPack} per pack
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between rounded-lg p-2">
      <p className="text-gray-600 text-lg mt-1">${product.price.toFixed(2)}</p>
        <span className="text-sm text-gray-600">In Stock: {product.stock}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleDecrement}
          className="px-3 text-2xl rounded-lg hover:bg-cyan-950 hover:text-cyan-100 justify-center"
        >
          -
        </button>
        <span className="text-lg font-medium">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="px-2 text-2xl rounded-lg hover:bg-cyan-950 hover:text-cyan-100"
        >
          +
        </button>
      </div>

      <button
        className="mt-4 bg-cyan-950 text-white px-4 py-2 rounded-lg w-full text-lg font-medium hover:bg-gray-700"
        onClick={() => addItemToCart(product, quantity)}
      >
        Add to Cart ({quantity})
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex items-center justify-center">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-contain w-full h-auto max-w-xs"
                />
              )}
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
              <p className="mb-2">
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </p>
              <p className="mb-2">
                <strong>Category:</strong> {product.category}
              </p>
              {product.description && (
                <p className="mb-2">
                  <strong>Description:</strong> {product.description}
                </p>
              )}
              <p className="mb-2">
                <strong>Stock:</strong> {product.stock}
              </p>
              <p className="mb-2">
                <strong>Popularity:</strong> {product.popularity}
              </p>
              <p className="mb-2">
                <strong>Created:</strong>{" "}
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
              {product.category === "Ungraded Card" && (
                <>
                  <p className="mb-2">
                    <strong>Condition:</strong> {product.condition}
                  </p>
                  <p className="mb-2">
                    <strong>Rarity:</strong> {product.rarity}
                  </p>
                </>
              )}
              {product.category === "Graded Card" && (
                <>
                  <p className="mb-2">
                    <strong>Grading Company:</strong>
                    {" "}{product.gradingCompany}
                  </p>
                  <p className="mb-2">
                    <strong>Grade:</strong> {product.grade}
                  </p>
                </>
              )}
              {product.category === "Accessory" && (
                <>
                  <p className="mb-2">
                    <strong>Accessory Type:</strong>{" "}
                    {product.accessoryType}
                  </p>
                  <p className="mb-2">
                    <strong>Quantity Per Pack:</strong>{" "}
                    {product.quantityPerPack}
                  </p>
                </>
              )}
              {product.details && (
                <>
                  {product.details.set && (
                    <p className="mb-2">
                      <strong>Set:</strong> {product.details.set}
                    </p>
                  )}
                  {product.details.cardNumber && (
                    <p className="mb-2">
                      <strong>Card Number:</strong>{" "}
                      {product.details.cardNumber}
                    </p>
                  )}
                </>
              )}
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-4">
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
                  onClick={() => addItemToCart(product, quantity)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg w-full text-lg font-medium hover:bg-gray-700"
                >
                  Add to Cart ({quantity})
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductCard;
