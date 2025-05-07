import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, nama, ukuran, harga, satuan, gambar } = product;

  return (
    <Link
      to={`/product/${id}`}
      className="block text-inherit no-underline"
    >
      <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="h-40 md:h-32 sm:h-28 overflow-hidden">
          <img
            src={gambar}
            alt={nama}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="flex flex-col flex-grow px-4 py-4 md:px-3 md:py-3 sm:px-3 sm:py-3">
          <h3 className="text-base md:text-sm font-semibold text-gray-800 mb-1">
            {nama}
          </h3>
          <p className="text-sm md:text-xs text-gray-600 mb-3">
            {ukuran}
          </p>
          <div className="mt-auto flex justify-between items-center sm:flex-col sm:items-start sm:gap-2">
            <p className="text-base md:text-sm text-gray-800 font-medium m-0">
              Rp {harga.toLocaleString()}
              <span className="text-xs md:text-[11px] font-normal text-gray-500">/{satuan}</span>
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Logic tambah ke keranjang
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-xs px-3 py-2 md:px-2 md:py-1 rounded transition-colors w-auto sm:w-full"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;