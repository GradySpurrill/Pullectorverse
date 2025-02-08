import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ShopSealed from "./ShopSealed";
import ShopSingles from "./ShopSingles";
import ShopGraded from "./ShopGraded";
import ShopAccessories from "./ShopAccessories";
import { Link } from "react-router-dom";
import { useCart } from "./components/cartContext";
import gsap from "gsap";

const conversionRates = {
  CAD: 1,
  USD: 0.75, // 1 CAD = 0.75 USD
};

const Shop = () => {
  const [category, setCategory] = useState("sealed");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const contentRef = useRef(null);

  // Currency State (Default: CAD, Stored in localStorage)
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "CAD");

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { x: -100, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, ease: "power2.out" }
      );
    }
  }, []);

  const handleCategoryChange = (newCategory) => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        x: 100,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          setCategory(newCategory);
          gsap.fromTo(
            contentRef.current,
            { x: -100, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 1, ease: "power2.out" }
          );
        },
      });
    } else {
      setCategory(newCategory);
    }
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

  // Handle currency change
  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 pb-10">
      <nav className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center">
          <img src="PVLOGOBASEV3.png" alt="Pullectorverse Logo" className="w-95 h-13" />
        </div>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-3 w-full rounded-lg shadow-sm text-cyan-900 focus:outline-none"
          />
        </div>
        <div className="flex gap-6 text-cyan-900 text-lg">
          <button>Account</button>
          <button>Shop</button>
          <button>Rip on Stream</button>
          <Link to="/cart" className="relative flex items-center">
            Cart
            {totalItems > 0 && (
              <span className="ml-1 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="relative">
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="px-2 py-2 rounded-lg font-medium text-cyan-950 bg-white cursor-pointer focus:outline-none"
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </nav>

      <div className="flex justify-center px-4 mt-4">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium text-cyan-950 shadow-sm ${
              category === "sealed" ? "bg-cyan-950 text-white" : "border"
            }`}
            onClick={() => handleCategoryChange("sealed")}
          >
            Sealed Pokemon Product
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-cyan-950 shadow-sm ${
              category === "singles" ? "bg-cyan-950 text-white" : "border"
            }`}
            onClick={() => handleCategoryChange("singles")}
          >
            Pokemon Singles
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-cyan-950 shadow-sm ${
              category === "graded" ? "bg-cyan-950 text-white" : "border"
            }`}
            onClick={() => handleCategoryChange("graded")}
          >
            Pokemon Graded Cards
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-cyan-950 shadow-sm ${
              category === "accessories" ? "bg-cyan-950 text-white" : "border"
            }`}
            onClick={() => handleCategoryChange("accessories")}
          >
            Accessories
          </button>
        </div>
      </div>

      <div ref={contentRef}>
        <div className="mt-8 px-4">
          {category === "sealed" && (
            <ShopSealed products={products} loading={loading} error={error} currency={currency} />
)}
          {category === "singles" && <ShopSingles products={products} currency={currency} />}
          {category === "graded" && <ShopGraded products={products} currency={currency} />}
          {category === "accessories" && <ShopAccessories products={products} currency={currency} />}
        </div>
      </div>
    </div>
  );
};

export default Shop;
