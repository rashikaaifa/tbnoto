
// ProductCard.jsx - Perbarui untuk menggunakan kategori dari API
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, categories }) => {
  // Fungsi untuk mendapatkan nama kategori dari API
  const getKategoriName = (kategoriId) => {
    const category = categories.find(cat => cat.id.toString() === kategoriId);
    return category ? category.nama_kategori : 'Kategori Tidak Diketahui';
  };

  // Cek apakah stok habis
  const isOutOfStock = product.stok === 0;

  return (
    <div className={`relative ${isOutOfStock ? 'order-last' : ''}`}>
      <Link
        to={`/product/${product.id}`}
        className={`bg-white p-3 rounded-xl border shadow-md text-left cursor-pointer hover:scale-105 transition-all duration-500 block relative ${
          isOutOfStock 
            ? 'opacity-60 hover:opacity-70 pointer-events-none cursor-not-allowed' 
            : ''
        }`}
      >
        <div className="relative">
          <img
            src={product.gambar}
            alt={product.nama}
            className={`w-full h-32 object-cover rounded-lg mb-2 ${
              isOutOfStock ? 'grayscale' : ''
            }`}
          />
          {/* Overlay stok habis */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center mb-2">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                STOK HABIS
              </span>
            </div>
          )}
        </div>
        
        <h3 className={`font-semibold text-lg ${isOutOfStock ? 'text-gray-500' : ''}`}>
          {product.nama}
        </h3>
        <p className={`text-sm ${isOutOfStock ? 'text-gray-400' : ''}`}>
          Kategori: {getKategoriName(product.kategori)}
        </p>
        <p className={`text-md ${isOutOfStock ? 'text-gray-400' : ''}`}>
          Rp{product.harga.toLocaleString()}
        </p>
        {isOutOfStock && (
          <p className="text-xs text-red-500 font-medium mt-1">
            Tidak tersedia
          </p>
        )}
      </Link>
    </div>
  );
};

export default ProductCard;