// FilterSelector.jsx
import React from 'react';
import '../styles/FilterSelector.css';

const FilterSelector = ({ categories, selectedCategory, onCategorySelect }) => {
  const handleChange = (e) => {
    onCategorySelect(e.target.value);
  };

  return (
    <div className="filter-selector">
      <select 
        value={selectedCategory} 
        onChange={handleChange}
        className="filter-select"
      >
        <option value="">Semua Kategori</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
      <div className="select-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default FilterSelector;