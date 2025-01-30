import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";
import ShopSingles from "./shopSingles";
import ShopGraded from "./shopGraded";
import ShopAccessories from "./shopAccessories";

const Shop = () => {
  const [category, setCategory] = useState("sealed");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map frontend categories to backend categories
  const categoryMap = {
    sealed: [
      "Booster Box",
      "Elite Trainer Box",
      "Collection Box",
      "Booster Pack",
      "Theme Deck",
      "Tin",
      "Booster Bundle"
    ],
    singles: ["Ungraded Card"],
    graded: ["Graded Card"],
    accessories: ["Accessory"]
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected category
  const filteredProducts = products.filter(product =>
    categoryMap[category].includes(product.category)
  );

  return (
    <div className="min-h-screen bg-white text-black px-6 pb-10">
      <nav className="flex justify-between items-center p-4 bg-white">
        {/* Navigation remains unchanged */}
        <div className="flex items-center gap-4">
          <img src="PVLOGOBASE.png" alt="Pullectorverse Logo" className="w-95 h-25" />
        </div>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search"
            className="border px-4 py-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div className="flex gap-6 text-gray-700 text-lg">
          <button>Account</button>
          <button>Shop</button>
          <button>Rip on Stream</button>
          <button>Cart</button>
          <button>CAD</button>
        </div>
      </nav>

      <div className="flex justify-center mt-6 px-4">
        <div className="flex gap-3">
          {/* Category buttons remain unchanged */}
          <button 
            className={`px-4 py-2 rounded-lg font-medium ${category === "sealed" ? "bg-gray-800 text-white" : "border"}`}
            onClick={() => setCategory("sealed")}
          >
            Sealed Pokemon Product
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium ${category === "singles" ? "bg-gray-800 text-white" : "border"}`}
            onClick={() => setCategory("singles")}
          >
            Pokemon Singles
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium ${category === "graded" ? "bg-gray-800 text-white" : "border"}`}
            onClick={() => setCategory("graded")}
          >
            Pokemon Graded Cards
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium ${category === "accessories" ? "bg-gray-800 text-white" : "border"}`}
            onClick={() => setCategory("accessories")}
          >
            Accessories
          </button>
        </div>
      </div>

      <div className="mt-8 px-4">
        <h2 className="text-4xl font-bold text-center mb-6">
          {category === "sealed" && "Sealed Pokemon Products"}
          {category === "singles" && "Pokemon Singles"}
          {category === "graded" && "Pokemon Graded Cards"}
          {category === "accessories" && "Accessories"}
        </h2>

        <div className="flex justify-end gap-3 mb-4">
          <button className="border px-4 py-2 rounded-lg">In-Stock Only</button>
          <button className="border px-4 py-2 rounded-lg">Out of Stock</button>
          <button className="border px-4 py-2 rounded-lg">Type ▼</button>
        </div>

        {loading ? (
          <div className="text-center text-lg">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;