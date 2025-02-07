import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./components/ProductCard";
import FilterBar from "./components/FilterBar";
import gsap from "gsap";

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

  const gridRef = useRef(null);

  useEffect(() => {
    if (gridRef.current && filteredProducts.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.18, ease: "power2.out" }
      );
    }
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-white text-black px-6 pb-10">
      <h2 className="text-4xl font-bold text-center my-6 text-cyan-950">
        Accessories
      </h2>
      <FilterBar filters={filters} setFilters={setFilters} category="accessories" />
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopAccessories;
