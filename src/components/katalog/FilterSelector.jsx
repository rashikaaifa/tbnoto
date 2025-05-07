import React from 'react';

const FilterSelector = ({ categories, selectedCategory, onCategorySelect }) => {
  const handleChange = (e) => {
    onCategorySelect(e.target.value);
  };

  return (
    <div className="relative w-44 sm:w-full flex-shrink-0">
      <select 
        value={selectedCategory} 
        onChange={handleChange}
        className="w-full pl-4 pr-10 py-3 rounded-lg text-sm border border-gray-300 shadow-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 cursor-pointer transition-all duration-200"
      >
        <option value="">Semua Kategori</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default FilterSelector;