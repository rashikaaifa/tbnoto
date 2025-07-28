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

  // Format harga dengan pemisah ribuan
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 mb-3 overflow-hidden transition-all duration-300 hover:shadow-md relative">
      {/* Tombol hapus */}
      <div
        className="absolute top-3 right-3 bg-white/90 text-red-600 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white hover:scale-105 shadow-sm z-10 text-xs"
        onClick={() => onRemove(product.id, product.name)}
      >
        🗑️
      </div>

      {/* Checkbox column */}
      <div className="p-3 flex items-start pt-4">
        <input
          type="checkbox"
          className="w-4 h-4 border border-gray-300 rounded cursor-pointer appearance-none checked:bg-green-700 checked:border-green-700 relative transition-all"
          checked={isSelected}
          onChange={onToggleSelect}
        />
      </div>

      {/* Gambar produk */}
      <div className="p-3 pl-0">
        <div className="w-24 h-24 relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg">
          <img
            className="w-full h-full object-cover"
            src={product.image}
            alt={product.name}
          />
        </div>
      </div>

      {/* Informasi produk */}
      <div className="flex-1 p-3 pr-10 flex flex-col justify-between">
        <div className="mb-1">
          <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-1">{product.name}</h3>
        </div>

        <div className="flex flex-col gap-1">
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
            {`Rp${formatPrice(product.price)}`}
          </div>
        </div>

        {/* Bagian bawah dengan harga dan kontrol jumlah */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
          <div className="text-sm font-bold text-green-800">
            {`Rp${formatPrice(totalPrice)}`}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 text-xs disabled:opacity-50"
              onClick={() => {
                if (quantity <= 1) {
                  onRemove(product.id, product.name); // Hapus produk jika jumlah tinggal 1
                } else {
                  onUpdateQuantity(-1); // Kurangi jumlah seperti biasa
                }
              }}
              disabled={quantity <= 0}
            >
              -
            </button>

            <span className="text-sm font-medium w-5 text-center">
              {quantity}
            </span>
            <button
              className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 text-xs disabled:opacity-50"
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