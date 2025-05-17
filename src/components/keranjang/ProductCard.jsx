// src/components/keranjang/ProductCard.jsx
import React from 'react';

const ProductCard = ({ 
  product, 
  isSelected, 
  quantity, 
  onToggleSelect, 
  onUpdateQuantity, 
  onRemove 
}) => {
  // Calculate total price based on quantity
  const totalPrice = product.price * quantity;

  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md relative">
      {/* Tombol hapus */}
      <div 
        className="absolute top-2 right-2 bg-white/90 text-red-600 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white hover:scale-105 shadow-sm z-10 text-xs"
        onClick={() => onRemove(product.id, product.name)}
      >
        🗑️
      </div>

      {/* Gambar produk */}
      <div className="w-20 h-20 relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg">
        <img
          className="max-w-full max-h-full w-auto h-auto object-contain"
          src={product.image}
          alt={product.name}
        />
      </div>
      
      {/* Informasi produk */}
      <div className="flex-1 p-2 flex flex-col justify-between ml-2">
        <div className="mb-1 mt-2 flex items-center gap-2">
          {/* Checkbox untuk seleksi produk */}
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              className="appearance-none w-4 h-4 border-2 border-gray-300 rounded cursor-pointer relative transition-all checked:bg-green-800 checked:border-green-800 after:content-['✓'] after:text-white after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:text-xs after:opacity-0 checked:after:opacity-100"
              checked={isSelected}
              onChange={onToggleSelect}
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-1">{product.name}</h3>
        </div>
        
        <div className="flex flex-col gap-0.5 mb-1">
          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-1 text-xs">📏</span>
            {product.size}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-1 text-xs">📦</span>
            {`Stok: ${product.quantity}`}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-1 text-xs">💰</span>
            {`Rp${product.price.toLocaleString()}`}
          </div>
        </div>
        
        {/* Bagian bawah dengan harga dan kontrol jumlah */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-auto">
          <div className="text-sm font-bold text-green-800">
            {`Rp${totalPrice.toLocaleString()}`}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 text-xs disabled:opacity-50"
              onClick={() => onUpdateQuantity(-1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="text-xs font-medium w-5 text-center">
              {quantity}
            </span>
            <button
              className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 text-xs disabled:opacity-50"
              onClick={() => onUpdateQuantity(1)}
              disabled={quantity >= product.quantity}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;