import React, { useState, useEffect } from "react";
import axios from "axios";
import ShopSealed from "./ShopSealed";
import ShopSingles from "./ShopSingles";
import ShopGraded from "./ShopGraded";
import ShopAccessories from "./ShopAccessories";

const Shop = () => {
  const [category, setCategory] = useState("sealed");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 

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

  return (
    <div className="min-h-screen bg-white text-black px-6 pb-10">
      <nav className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center">
          <img
            src="PVLOGOBASE.png"
            alt="Pullectorverse Logo"
            className="w-95 h-25"
          />
        </div>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="flex justify-center px-4">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium text-cyan-950 ${
              category === "sealed" ? "bg-cyan-950 text-white" : "border"
            }`}
            onClick={() => setCategory("sealed")}
          >
            Sealed Pokemon Product
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-cyan-950 ${
              category === "singles" ? "bg-cyan-950 text-white" : "border"
            }`}
            onClick={() => setCategory("singles")}
          >
            Pokemon Singles
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-cyan-950 ${
              category === "graded" ? "bg-cyan-950 text-white" : "border"
            }`}
            onClick={() => setCategory("graded")}
          >
            Pokemon Graded Cards
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-cyan-950 ${
              category === "accessories" ? "bg-cyan-950 text-white" : "border"
            }`}
            onClick={() => setCategory("accessories")}
          >
            Accessories
          </button>
        </div>
      </div>

      <div className="mt-8 px-4">
        {category === "sealed" && (
          <ShopSealed
            products={products.filter((product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            loading={loading}
            error={error}
          />
        )}
        {category === "singles" && (
          <ShopSingles
            products={products.filter((product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
          />
        )}
        {category === "graded" && (
          <ShopGraded
            products={products.filter((product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
          />
        )}
        {category === "accessories" && (
          <ShopAccessories
            products={products.filter((product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Shop;
