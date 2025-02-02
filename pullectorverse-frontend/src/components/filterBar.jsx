import React, { useState, useEffect } from "react";

const FilterBar = ({ filters, setFilters, category }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (filters.priceRange === null) {
      setMinPrice("");
      setMaxPrice("");
    }
  }, [filters.priceRange]);

  useEffect(() => {
    if (minPrice === "" && maxPrice === "") {
      setFilters((prev) => ({ ...prev, priceRange: null }));
    } else {
      const min = minPrice === "" ? 0 : parseFloat(minPrice);
      const max = maxPrice === "" ? Infinity : parseFloat(maxPrice);
      setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
    }
  }, [minPrice, maxPrice, setFilters]);

  const handleClearFilters = () => {
    setFilters({
      inStock: null,
      priceRange: null,
      productTypes: [],
      condition: "",
      rarity: "",
      setName: "",
      gradingCompany: "",
      grade: "",
      accessoryType: "",
      quantityPerPack: "",
      sortBy: "",
    });
  };

  return (
    <div className="w-full py-4">
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="flex flex-col items-center mr-60">
          <label className="font-medium">Price Range</label>
          <div className="flex items-center">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border rounded px-2 py-0.5 mr-2"
              min="0"
            />
            <span className="mx-1">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border rounded px-2 py-0.5 ml-2"
              min="0"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label className="text-xl font-medium -ml-27">Stock</label>
          <div className="flex gap-2 mr-20">
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  inStock: prev.inStock === "in" ? null : "in",
                }))
              }
              className={`px-3 py-1 rounded border text-sm ${
                filters.inStock === "in"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  inStock: prev.inStock === "out" ? null : "out",
                }))
              }
              className={`px-3 py-1 rounded border text-sm ${
                filters.inStock === "out"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>

        {category === "sealed" && (
          <div className="flex flex-col items-center">
            <label className="text-xl font-medium">Product Type</label>
            <div className="flex flex-wrap gap-2">
              {[
                "Booster Box",
                "Booster Pack",
                "Elite Trainer Box",
                "Collection Box",
                "Blister Pack",
                "Tin",
                "Theme Deck",
                "Booster Bundle",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setFilters((prev) => {
                      const current = prev.productTypes || [];
                      return current.includes(type)
                        ? {
                            ...prev,
                            productTypes: current.filter((t) => t !== type),
                          }
                        : { ...prev, productTypes: [...current, type] };
                    })
                  }
                  className={`px-3 py-1 rounded border text-sm ${
                    filters.productTypes && filters.productTypes.includes(type)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {category === "singles" && (
          <>
            <div className="flex flex-col items-center mr-20">
              <label className="text-xl font-medium">Condition</label>
              <div className="flex gap-2">
                {["Near Mint", "Light Play", "Moderate Play", "Heavy Play"].map(
                  (cond) => (
                    <button
                      key={cond}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          condition: prev.condition === cond ? "" : cond,
                        }))
                      }
                      className={`px-3 py-1 rounded border text-sm ${
                        filters.condition === cond
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {cond}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xl font-medium">Rarity</label>
              <div className="flex gap-2">
                {[
                  "Common",
                  "Uncommon",
                  "Rare",
                  "Holo Rare",
                  "Special Illustration Rare",
                  "Hyper Rare",
                ].map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        rarity: prev.rarity === rarity ? "" : rarity,
                      }))
                    }
                    className={`px-3 py-1 rounded border text-sm ${
                      filters.rarity === rarity
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {category === "graded" && (
          <>
            <div className="flex flex-col items-center">
              <label className="text-xl font-medium -ml-20">
                Grading Company
              </label>
              <div className="flex gap-2 mr-20">
                {["PSA", "BGS", "CGC", "TAG"].map((company) => (
                  <button
                    key={company}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        gradingCompany:
                          prev.gradingCompany === company ? "" : company,
                      }))
                    }
                    className={`px-3 py-1 rounded border text-sm ${
                      filters.gradingCompany === company
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label className="font-medium">Grade</label>
              <div className="flex gap-2">
                {["10", "9.5", "9", "8.5", "8", "Other"].map((grade) => (
                  <button
                    key={grade}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        grade: prev.grade === grade ? "" : grade,
                      }))
                    }
                    className={`px-3 py-1 rounded border text-sm ${
                      filters.grade === grade
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {category === "accessories" && (
          <div className="flex flex-col items-center">
            <label className="font-medium">Accessory Type</label>
            <div className="flex gap-2">
              {["Card Sleeves", "Top Loaders", "Deck Boxes", "Binders"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        accessoryType: prev.accessoryType === type ? "" : type,
                      }))
                    }
                    className={`px-3 py-1 rounded border text-sm ${
                      filters.accessoryType === type
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          <button
            onClick={handleClearFilters}
            className="px-4 py-1 rounded bg-red-500 text-white text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
