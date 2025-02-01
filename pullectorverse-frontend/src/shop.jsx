import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";
import FilterBar from "./components/FilterBar";
import ShopSingles from "./ShopSingles";
import ShopGraded from "./ShopGraded";
import ShopAccessories from "./ShopAccessories";


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

const Shop = () => {
  const [category, setCategory] = useState("sealed");
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

  let filteredProducts = [];
  if (category === "sealed") {
    filteredProducts = products.filter((product) =>
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
  }

  return (
    <>
        <style>{`
          html {
            overflow-y: scroll;
            scrollbar-gutter: stable;
          }
        `}</style>
    <div className="min-h-screen bg-white text-black px-6 pb-10 " >

      <nav className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center gap-4">
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
            className={`px-4 py-2 rounded-lg font-medium ${
              category === "sealed" ? "bg-gray-800 text-white" : "border"
            }`}
            onClick={() => setCategory("sealed")}
          >
            Sealed Pokemon Product
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              category === "singles" ? "bg-gray-800 text-white" : "border"
            }`}
            onClick={() => setCategory("singles")}
          >
            Pokemon Singles
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              category === "graded" ? "bg-gray-800 text-white" : "border"
            }`}
            onClick={() => setCategory("graded")}
          >
            Pokemon Graded Cards
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              category === "accessories" ? "bg-gray-800 text-white" : "border"
            }`}
            onClick={() => setCategory("accessories")}
          >
            Accessories
          </button>
        </div>
      </div>

      <div className="mt-8 px-4">
        {category === "sealed" && (
          <>
            <h2 className="text-4xl font-bold text-center mb-6">
              Sealed Pokemon Products
            </h2>
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              category="sealed"
            />
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
          </>
        )}
        {category === "singles" && <ShopSingles products={products} />}
        {category === "graded" && <ShopGraded products={products} />}
        {category === "accessories" && <ShopAccessories products={products} />}
      </div>
    </div>
    </>
  );
};

export default Shop;
