// ProductCard.jsx - Improved UI for ProductGrid
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.gambar}
            alt={product.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">
            {product.nama}
          </h3>
          <p className="text-sm text-gray-500 mb-2 truncate">
            {product.ukuran || product.deskripsi}
          </p>
          <div className="mt-auto flex justify-between items-center">
            <span className="font-bold text-gray-900">
              Rp{product.harga.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              Stok: {product.stok}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;