import React, { useState, useEffect } from "react";

const setsData = [
  {
    group: "Scarlet & Violet",
    options: [
      { label: "Scarlet & Violet", value: "Scarlet & Violet" },
      { label: "Prismatic Evolutions", value: "Prismatic Evolutions" },
      { label: "Surging Sparks", value: "Surging Sparks" },
      { label: "Stellar Crown", value: "Stellar Crown" },
      { label: "Shrouded Fable", value: "Shrouded Fable" },
      { label: "Twilight Masquerade", value: "Twilight Masquerade" },
      { label: "Temporal Forces", value: "Temporal Forces" },
      { label: "Paldean Fates", value: "Paldean Fates" },
      { label: "Paradox Rift", value: "Paradox Rift" },
      { label: "151", value: "151" },
      { label: "McDonald’s Match Battle 2023", value: "McDonald’s Match Battle 2023" },
      { label: "Obsidian Flames", value: "Obsidian Flames" },
      { label: "Paldea Evolved", value: "Paldea Evolved" },
    ],
  },
  {
    group: "Sword & Shield",
    options: [
      { label: "Sword & Shield", value: "Sword & Shield" },
      { label: "Crown Zenith", value: "Crown Zenith" },
      { label: "Silver Tempest", value: "Silver Tempest" },
      { label: "Lost Origin", value: "Lost Origin" },
      { label: "McDonald’s Collection 2022", value: "McDonald’s Collection 2022" },
      { label: "Pokémon GO (PGO)", value: "Pokémon GO (PGO)" },
      { label: "Astral Radiance (ASR)", value: "Astral Radiance (ASR)" },
      { label: "Sword & Shield Energy", value: "Sword & Shield Energy" },
      { label: "Brilliant Stars", value: "Brilliant Stars" },
      { label: "Fusion Strike", value: "Fusion Strike" },
      { label: "Celebrations", value: "Celebrations" },
      { label: "Evolving Skies", value: "Evolving Skies" },
      { label: "Chilling Reign", value: "Chilling Reign" },
      { label: "Battle Styles", value: "Battle Styles" },
      { label: "Shining Fates", value: "Shining Fates" },
      { label: "Vivid Voltage", value: "Vivid Voltage" },
      { label: "Champion’s Path", value: "Champion’s Path" },
      { label: "Darkness Ablaze", value: "Darkness Ablaze" },
      { label: "Rebel Clash", value: "Rebel Clash" },
    ],
  },
  {
    group: "Sun & Moon",
    options: [
      { label: "Sun & Moon", value: "Sun & Moon" },
      { label: "Cosmic Eclipse", value: "Cosmic Eclipse" },
      { label: "McDonald’s Collection 2019", value: "McDonald’s Collection 2019" },
      { label: "Hidden Fates", value: "Hidden Fates" },
      { label: "Unified Minds", value: "Unified Minds" },
      { label: "Unbroken Bonds", value: "Unbroken Bonds" },
      { label: "Detective Pikachu", value: "Detective Pikachu" },
      { label: "Team Up (TEU)", value: "Team Up (TEU)" },
      { label: "Sun & Moon Energy", value: "Sun & Moon Energy" },
      { label: "Lost Thunder", value: "Lost Thunder" },
      { label: "Dragon Majesty", value: "Dragon Majesty" },
      { label: "Celestial Storm", value: "Celestial Storm" },
      { label: "Forbidden Light", value: "Forbidden Light" },
      { label: "Ultra Prism", value: "Ultra Prism" },
      { label: "Crimson Invasion", value: "Crimson Invasion" },
      { label: "Shining Legends", value: "Shining Legends" },
      { label: "Burning Shadows", value: "Burning Shadows" },
      { label: "Guardians Rising", value: "Guardians Rising" },
    ],
  },
  {
    group: "XY",
    options: [
      { label: "XY", value: "XY" },
      { label: "Evolutions", value: "Evolutions" },
      { label: "McDonald’s Collection 2016", value: "McDonald’s Collection 2016" },
      { label: "Steam Siege", value: "Steam Siege" },
      { label: "Fates Collide", value: "Fates Collide" },
      { label: "XY Trainer Kit—Suicune", value: "XY Trainer Kit—Suicune" },
      { label: "XY Trainer Kit—Pikachu Libre", value: "XY Trainer Kit—Pikachu Libre" },
      { label: "Generations", value: "Generations" },
      { label: "BREAKpoint", value: "BREAKpoint" },
      { label: "BREAKthrough", value: "BREAKthrough" },
      { label: "Ancient Origins", value: "Ancient Origins" },
      { label: "Roaring Skies", value: "Roaring Skies" },
      { label: "Double Crisis", value: "Double Crisis" },
      { label: "Primal Clash", value: "Primal Clash" },
      { label: "Phantom Forces", value: "Phantom Forces" },
      { label: "XY Trainer Kit—Wigglytuff", value: "XY Trainer Kit—Wigglytuff" },
      { label: "XY Trainer Kit—Bisharp", value: "XY Trainer Kit—Bisharp" },
      { label: "Furious Fists", value: "Furious Fists" },
      { label: "Flashfire", value: "Flashfire" },
    ],
  },
  {
    group: "Black & White",
    options: [
      { label: "Black & White", value: "Black & White" },
      { label: "Legendary Treasures", value: "Legendary Treasures" },
      { label: "Plasma Blast", value: "Plasma Blast" },
      { label: "Plasma Freeze", value: "Plasma Freeze" },
      { label: "Plasma Storm", value: "Plasma Storm" },
      { label: "Boundaries Crossed", value: "Boundaries Crossed" },
      { label: "Dragon Vault", value: "Dragon Vault" },
      { label: "Dragons Exalted", value: "Dragons Exalted" },
      { label: "McDonald’s Collection", value: "McDonald’s Collection" },
      { label: "Dark Explorers", value: "Dark Explorers" },
      { label: "Next Destinies", value: "Next Destinies" },
      { label: "Noble Victories", value: "Noble Victories" },
      { label: "Black & White Trainer Kit—Zoroark", value: "Black & White Trainer Kit—Zoroark" },
      { label: "Black & White Trainer Kit—Excadrill", value: "Black & White Trainer Kit—Excadrill" },
      { label: "Emerging Powers", value: "Emerging Powers" },
      { label: "McDonald’s Collection 2011", value: "McDonald’s Collection 2011" },
    ],
  },
  {
    group: "HeartGold & SoulSilver",
    options: [
      { label: "HeartGold & SoulSilver", value: "HeartGold & SoulSilver" },
      { label: "Call of Legends", value: "Call of Legends" },
      { label: "Triumphant", value: "Triumphant" },
      { label: "Undaunted", value: "Undaunted" },
      { label: "Unleashed", value: "Unleashed" },
      { label: "HS Trainer Kit—Raichu", value: "HS Trainer Kit—Raichu" },
      { label: "HS Trainer Kit—Gyarados", value: "HS Trainer Kit—Gyarados" },
    ],
  },
  {
    group: "Classic",
    options: [
      { label: "Classic", value: "Classic" },
      { label: "Team Rocket", value: "Team Rocket" },
      { label: "Base Set 2", value: "Base Set 2" },
      { label: "Fossil", value: "Fossil" },
      { label: "Jungle", value: "Jungle" },
      { label: "Base Set", value: "Base Set" },
    ],
  },
];

const FilterBar = ({ filters, setFilters, category }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [setSearchTerm, setSetSearchTerm] = useState("");
  const [isSetDropdownOpen, setIsSetDropdownOpen] = useState(false);

  const filteredSetsData = setsData
    .map((group) => ({
      ...group,
      options: group.options.filter(
        (option) =>
          option.label.toLowerCase().includes(setSearchTerm.toLowerCase()) &&
          option.value !== group.group
      ),
    }))
    .filter((group) => group.options.length > 0);

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
      setOrExpansion: "",
      gradingCompany: "",
      grade: "",
      accessoryType: "",
      quantityPerPack: "",
      sortBy: "",
    });
  };

  return (
    <div className="w-full py-4 mb-4">
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="flex flex-col items-center transform scale-75">
          <label className="text-xl font-medium mb-2 text-cyan-950">Price Range</label>
          <div className="flex items-center">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="px-3 py-1 rounded border text-sm text-cyan-950"
              min="0"
            />
            <span className="mx-1">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-3 py-1 rounded border text-sm text-cyan-950"
              min="0"
            />
          </div>
        </div>

        <div className="flex flex-col items-center transform scale-75">
          <label className="text-xl font-medium mb-2 mr-20 text-cyan-950">Stock</label>
          <div className="flex gap-2 -ml-15">
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  inStock: prev.inStock === "in" ? null : "in",
                }))
              }
              className={`px-3 py-1 rounded border text-sm ${
                filters.inStock === "in"
                  ? "bg-cyan-950 text-white"
                  : "bg-white text-cyan-950"
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
                  ? "bg-cyan-950 text-white"
                  : "bg-white text-cyan-950"
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>

        {category === "sealed" && (
          <div className="flex flex-col items-center transform scale-75">
            <label className="text-xl font-medium mb-2 text-cyan-950">Product Type</label>
            <div className="flex flex-wrap gap-2 -ml-30">
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
                      ? "bg-cyan-950 text-white"
                      : "bg-white text-cyan-950"
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
            <div className="flex flex-col items-center transform scale-75 mr-20">
              <label className="text-xl font-medium mb-2 text-cyan-950">Condition</label>
              <div className="flex gap-2 -ml-10">
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
                          ? "bg-cyan-950 text-white"
                          : "bg-white text-cyan-950"
                      }`}
                    >
                      {cond}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col items-center transform scale-75">
              <label className="text-xl font-medium mb-2 text-cyan-950">Rarity</label>
              <div className="flex gap-2 -ml-40">
                {["Reverse Holo", "Holo Rare", "SIR", "Hyper Rare"].map(
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
                          ? "bg-cyan-950 text-white"
                          : "bg-white text-cyan-950"
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
            <div className="flex flex-col items-center transform scale-75">
              <label className="text-xl font-medium -ml-20 mb-2 text-cyan-950">
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
                        ? "bg-cyan-950 text-white"
                        : "bg-white text-cyan-950"
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center transform scale-75">
              <label className="text-xl font-medium mb-2 -ml-20 text-cyan-950">Grade</label>
              <div className="flex gap-2 -ml-20">
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
                        ? "bg-cyan-950 text-white"
                        : "bg-white text-cyan-950"
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
          <div className="flex flex-col items-center transform scale-75">
            <label className="text-xl font-medium mb-2 text-cyan-950">Accessory Type</label>
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
                        ? "bg-cyan-950 text-white"
                        : "bg-white text-cyan-950"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {category !== "accessories" && (
        <div className="flex flex-col items-center transform scale-70">
          <label className="text-xl font-medium mb-1 -ml-10 text-cyan-950">Set</label>
          <div className="relative w-50 -ml-10 text-cyan-950 mt-1 -mb-1">
            <div
              className="border rounded px-2 py-1 cursor-pointer text-cyan-950"
              onClick={() => setIsSetDropdownOpen(!isSetDropdownOpen)}
            >
              {filters.setOrExpansion ? filters.setOrExpansion : "Select Expansion"}
            </div>
            {isSetDropdownOpen && (
              <div className="absolute top-full bg-white border rounded w-full max-h-100 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search expansions..."
                  className="w-full p-2 border-b"
                  value={setSearchTerm}
                  onChange={(e) => setSetSearchTerm(e.target.value)}
                />
                {filteredSetsData.map((group) => {
                  const expansionOptions = group.options.filter(
                    (option) => option.value !== group.group
                  );
                  if (expansionOptions.length === 0) return null;
                  return (
                    <div key={group.group}>
                      <div className="font-bold p-2 border-b">{group.group}</div>
                      {expansionOptions.map((option) => (
                        <div
                          key={option.value}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              setOrExpansion: option.value,
                            }));
                            setIsSetDropdownOpen(false);
                            setSetSearchTerm("");
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        )}

        <div className="flex flex-col items-center transform scale-75">
          <button
            onClick={handleClearFilters}
            className="px-4 py-1 rounded bg-cyan-950 text-white text-sm mt-8 -ml-10"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
