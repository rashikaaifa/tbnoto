// ProductCard.jsx - Updated to match the second design with proper API data integration
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Function to get category name based on category ID
  const getKategoriName = (kategoriId) => {
    const categoryNames = {
      '1': 'Kayu',
      '2': 'Besi',
      '3': 'Paralon',
      '4': 'Triplek',
      '5': 'Semen',
      '8': 'Lainnya',
      // Add more categories as needed
    };
    
    return categoryNames[kategoriId] || `Kategori ${kategoriId}`;
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