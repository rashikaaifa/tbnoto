// ProductCard.jsx - Perbarui untuk menggunakan kategori dari API
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, categories }) => {
  // Fungsi untuk mendapatkan nama kategori dari API
  const getKategoriName = (kategoriId) => {
    const category = categories.find(cat => cat.id.toString() === kategoriId);
    return category ? category.nama_kategori : 'Kategori Tidak Diketahui';
  };

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
      <p className="text-sm">Kategori: {getKategoriName(product.kategori)}</p>
      <p className="text-md">Rp{product.harga.toLocaleString()}</p>
    </Link>
  );
};

export default ProductCard;