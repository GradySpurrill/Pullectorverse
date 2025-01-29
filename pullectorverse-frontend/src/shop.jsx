import React, { useState } from "react";
import ShopSingles from "./shopSingles";
import ShopGraded from "./shopGraded";
import ShopAccessories from "./shopAccessories";
import ProductCard from "./components/productCard";


const Shop = () => {
  const [category, setCategory] = useState("sealed"); 

  return (
    <div className="min-h-screen bg-white text-black px-6 pb-10">
      <nav className="flex justify-between items-center p-4 bg-white">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {category === "sealed" && (
            <>
              <ProductCard name="Booster Box" price="$159.99" image="sealed1.png" />
              <ProductCard name="Elite Trainer Box" price="$149.99" image="prissy.png" />
            </>
          )}

          {category === "singles" && <ShopSingles />} 
          {category === "graded" && <ShopGraded />} 
          {category === "accessories" && <ShopAccessories />} 
        </div>
      </div>
    </div>
  );
};

export default Shop;
