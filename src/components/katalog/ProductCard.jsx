// ProductCard.jsx - Updated version without getKategoriName
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white p-3 rounded-xl border shadow-md text-left cursor-pointer hover:scale-105 transition-all duration-500 block"
    >
      <img
        src={product.gambar}
        alt={product.nama}
        className="w-full h-32 object-cover rounded-lg mb-2"
      />
      <h3 className="font-semibold text-lg">{product.nama}</h3>
      {/* Jika tetap ingin menampilkan kategori, bisa langsung pakai ID kategori */}
      <p className="text-sm">Kategori: {product.kategori}</p>
      <p className="text-md">Rp{product.harga.toLocaleString()}</p>
    </Link>
  );
};

export default ProductCard;