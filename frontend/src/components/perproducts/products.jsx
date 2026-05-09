import React, { useState, useContext } from "react";
import { shopcontext } from "../../context/shopcontext";
import Item from "../Items/Items";
import Filter from "../filter/Filter";

const Products = () => {
  const { all_product, productsLoading } = useContext(shopcontext);
  const [filteredProducts, setFilteredProducts] = useState(null);

  const handleFilter = ({ selectedCategory, searchName, sortBy }) => {
    let filtered = [...all_product];
    if (selectedCategory)
      filtered = filtered.filter((item) => item.category === selectedCategory);
    if (searchName)
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchName.toLowerCase())
      );
    if (sortBy === "price_asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "name_asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name_desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
    setFilteredProducts(filtered);
  };

  const displayed = filteredProducts ?? all_product;

  if (productsLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center -mt-7">
      <Filter onFilter={handleFilter} />
      <div className="flex flex-col items-center justify-center w-full bg-cover bg-center">
        <hr className="border-gray-700 mb-5" />
        <div className="w-full p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {displayed.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                price={
                  <span className="text-[#8c34eb]">${item.price}</span>
                }
              />
            ))}
          </div>
          {displayed.length === 0 && (
            <p className="text-gray-400 text-center mt-8">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
