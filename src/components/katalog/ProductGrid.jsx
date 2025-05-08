// ProductGrid.jsx - Improved UI with 5 cards per row
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700">
          Tidak ada produk yang ditemukan.
        </h3>
        <p className="text-gray-500 mt-2">
          Coba gunakan filter atau kata kunci pencarian yang berbeda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;