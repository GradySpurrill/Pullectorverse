import React, { useState } from "react";
import ProductCard from "./components/ProductCard";
import FilterBar from "./components/FilterBar";

const ShopSingles = ({ products }) => {
  const [filters, setFilters] = useState({
    inStock: null,
    priceRange: null,
    condition: "",
    rarity: "",
    setName: "",
    sortBy: "",
  });


  let filteredProducts = products.filter(
    (product) => product.category === "Ungraded Card"
  );


  filteredProducts = filteredProducts.filter((product) => {
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) return false;
    }
    if (filters.inStock === "in" && product.stock <= 0) return false;
    if (filters.inStock === "out" && product.stock > 0) return false;
    if (filters.condition && product.condition !== filters.condition)
      return false;
    if (filters.rarity && product.rarity !== filters.rarity) return false;
    if (filters.setName && product.details?.set !== filters.setName)
      return false;
    return true;
  });


  if (filters.sortBy) {
    switch (filters.sortBy) {
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
      <h2 className="text-4xl font-bold text-center my-6">Pokemon Singles</h2>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        category="singles"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopSingles;
