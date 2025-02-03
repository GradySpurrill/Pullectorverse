import React, { useState } from "react";
import ProductCard from "./components/ProductCard";
import FilterBar from "./components/FilterBar";

const ShopAccessories = ({ products }) => {
  const [filters, setFilters] = useState({
    inStock: null,
    priceRange: null,
    accessoryType: "",
    quantityPerPack: "",
    sortBy: "",
  });


  let filteredProducts = products.filter(
    (product) => product.category === "Accessory"
  );


  filteredProducts = filteredProducts.filter((product) => {
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) return false;
    }
    if (filters.inStock === "in" && product.stock <= 0) return false;
    if (filters.inStock === "out" && product.stock > 0) return false;
    if (filters.accessoryType && product.accessoryType !== filters.accessoryType)
      return false;
    if (
      filters.quantityPerPack &&
      product.quantityPerPack !== Number(filters.quantityPerPack)
    )
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
      <h2 className="text-4xl font-bold text-center my-6 text-cyan-950">Accessories</h2>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        category="accessories"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopAccessories;
