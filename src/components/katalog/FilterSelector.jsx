// FilterSelector.jsx - Improved UI
import React from 'react';

const FilterSelector = ({ categories, selectedCategory, onCategorySelect }) => {
  // Pemetaan kategori_id ke nama kategori yang lebih deskriptif
  const categoryNames = {
    '1': 'Kayu',
    '2': 'Besi',
    '3': 'Paralon',
    '4': 'Triplek',
    '5': 'Semen',
    // Tambahkan kategori lain sesuai kebutuhan
  };

  const handleCategoryChange = (e) => {
    onCategorySelect(e.target.value);
  };

  return (
    <div className="w-64">
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg ring-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
      >
        <option value="">Semua Kategori</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {categoryNames[category] || `Kategori ${category}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelector;