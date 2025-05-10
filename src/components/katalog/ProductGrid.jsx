// ProductGrid.jsx - Fixed width layout regardless of product count
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  return (
    <div className="w-full">
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">
            Tidak ada produk yang ditemukan.
          </h3>
          <p className="text-gray-500 mt-2">
            Coba gunakan filter atau kata kunci pencarian yang berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;