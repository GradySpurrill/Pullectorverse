import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";
import FilterBar from "./components/FilterBar";

const sealedCategories = [
  "Booster Box",
  "Elite Trainer Box",
  "Collection Box",
  "Booster Pack",
  "Theme Deck",
  "Tin",
  "Booster Bundle",
  "Blister Pack",
];

const ShopSealed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    inStock: null,
    priceRange: null,
    productTypes: [],
    sortBy: "",
  });

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

  let filteredProducts = products.filter((product) =>
    sealedCategories.includes(product.category)
  );

  filteredProducts = filteredProducts.filter((product) => {
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) return false;
    }
    if (filters.inStock === "in" && product.stock <= 0) return false;
    if (filters.inStock === "out" && product.stock > 0) return false;
    if (
      filters.productTypes.length > 0 &&
      !filters.productTypes.includes(product.category)
    )
      return false;
    return true;
  });

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "popularity":
        filteredProducts.sort((a, b) => b.popularity - a.popularity);
        break;
      case "new":
        filteredProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "priceLowHigh":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 pb-10">
      <h2 className="text-4xl font-bold text-center my-6">
        Sealed Pokemon Products
      </h2>
      <FilterBar filters={filters} setFilters={setFilters} category="sealed" />
      {loading ? (
        <div className="text-center text-lg">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopSealed;
