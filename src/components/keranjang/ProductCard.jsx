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
  // Stok dari server
  const stockFromServer =
    typeof product.stock === 'number'
      ? product.stock
      : typeof product.quantity === 'number'
      ? product.quantity
      : 0;

  // Hanya untuk tampilan: stok sisa = stok server - qty di keranjang user
  const displayedStock = Math.max(0, stockFromServer - (quantity || 0));

  const canDecrement = quantity > 0;
  const totalPrice = (product.price || 0) * (quantity || 0);

  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 mb-3 overflow-hidden transition-all duration-300 hover:shadow-md relative">
      {/* Tombol hapus */}
      <div
        className="absolute top-3 right-3 bg-white/90 text-red-600 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white hover:scale-105 shadow-sm z-10 text-xs"
        onClick={() => onRemove(product.id, product.name)}
        title="Hapus dari keranjang"
      >
        🗑️
      </div>

      {/* Checkbox */}
      <div className="p-3 flex items-start pt-4">
        <input
          type="checkbox"
          className="w-4 h-4 border border-gray-300 rounded cursor-pointer appearance-none checked:bg-green-700 checked:border-green-700 relative transition-all"
          checked={isSelected}
          onChange={onToggleSelect}
        />
      </div>

      {/* Gambar */}
      <div className="p-3 pl-0">
        <div className="w-24 h-24 relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg">
          <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 p-3 pr-10 flex flex-col justify-between">
        <div className="mb-1">
          <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-1 text-xs">📏</span>
            {product.size}
          </div>

          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-1 text-xs">📦</span>
            {`Stok: ${displayedStock}`}
          </div>

          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-1 text-xs">💰</span>
            {`Rp${formatPrice(product.price || 0)}`}
          </div>
        </div>

        {/* Harga & kontrol jumlah */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
          <div className="text-sm font-bold text-green-800">
            {`Rp${formatPrice(totalPrice)}`}
          </div>

          <div className="flex items-center gap-2">
            {/* Kurang / Hapus */}
            <button
              className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 text-xs disabled:opacity-50"
              onClick={() => {
                if (quantity <= 1) onRemove(product.id, product.name);
                else onUpdateQuantity(-1);
              }}
              disabled={!canDecrement}
              title={quantity <= 1 ? 'Hapus item' : 'Kurangi'}
            >
              -
            </button>

            <span className="text-sm font-medium w-5 text-center">{quantity}</span>

            {/* Tambah — tidak pernah disabled; hanya “redup” saat stok 0 */}
            <button
              className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors text-xs
                ${stockFromServer > 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-100 opacity-50 cursor-default'}`}
              onClick={() => {
                // Biarkan hook yang membatasi. Kalau stok 0, klik tidak akan menaikkan qty.
                onUpdateQuantity(1);
              }}
              // ❌ JANGAN gunakan atribut disabled di sini
              title={stockFromServer > 0 ? 'Tambah' : 'Stok habis'}
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
