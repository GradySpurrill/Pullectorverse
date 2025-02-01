import React from "react";

const FilterBar = ({ filters, setFilters, category }) => {

  const handlePriceRangeChange = (e) => {
    const value = e.target.value;
    let range = null;
    if (value === "") {
      range = null;
    } else if (value === "0-10") {
      range = [0, 10];
    } else if (value === "11-50") {
      range = [11, 50];
    } else if (value === "50-100") {
      range = [50, 100];
    } else if (value === "100-199") {
      range = [100, 199];
    } else if (value === "200-300") {
      range = [200, 300];
    } else if (value === "301++") {
      range = [301, Infinity];
    }
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };


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

    <div className="w-full max-w-6xl mx-auto px-4 py-4">

      <div className="flex flex-wrap justify-center items-center gap-4">

        <div className="flex flex-col items-center">
          <label className="font-medium">Price Range</label>
          <select
            onChange={handlePriceRangeChange}
            defaultValue=""
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="0-10">$0 - $10</option>
            <option value="11-50">$11 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-199">$100 - $199</option>
            <option value="200-300">$200 - $300</option>
            <option value="301++">$301+</option>
          </select>
        </div>


        <div className="flex flex-col items-center">
          <label className="font-medium">Stock</label>
          <div className="flex gap-2">
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
            <label className="font-medium">Product Type</label>
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
                        ? { ...prev, productTypes: current.filter((t) => t !== type) }
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
            <div className="flex flex-col items-center">
              <label className="font-medium">Condition</label>
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
              <label className="font-medium">Rarity</label>
              <div className="flex gap-2">
                {["Common", "Uncommon", "Rare", "Holo Rare", "Special Illustration Rare", "Hyper Rare"].map(
                  (rarity) => (
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
                  )
                )}
              </div>
            </div>

          </>
        )}

        {category === "graded" && (
          <>
            <div className="flex flex-col items-center">
              <label className="font-medium">Grading Company</label>
              <div className="flex gap-2">
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
          <>
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
          </>
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
