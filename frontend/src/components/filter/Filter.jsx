import React, { useState } from "react";

const Filter = ({ onFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchName, setSearchName] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleApply = () => {
    onFilter({ selectedCategory, searchName, sortBy });
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSearchName("");
    setSortBy("");
    onFilter({ selectedCategory: "", searchName: "", sortBy: "" });
  };

  return (
    <div className="p-3 border rounded-md shadow-sm bg-gray-400 py-2 mt-5 -mb-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1">
          <label htmlFor="search" className="text-sm font-medium p-1">Search</label>
          <input
            id="search"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Product name..."
            className="p-1 text-sm border rounded-md w-36"
          />
        </div>
        <div className="flex items-center space-x-1">
          <label htmlFor="category" className="text-sm font-medium p-1">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1 text-sm border rounded-md"
          >
            <option value="">All Products</option>
            <option value="Phasmophobia">Phasmophobia</option>
            <option value="Valorant">Valorant</option>
          </select>
        </div>
        <div className="flex items-center space-x-1">
          <label htmlFor="sort" className="text-sm font-medium p-1">Sort</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-1 text-sm border rounded-md"
          >
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A → Z</option>
            <option value="name_desc">Name: Z → A</option>
          </select>
        </div>
        <button
          onClick={handleApply}
          className="p-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="p-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Filter;
