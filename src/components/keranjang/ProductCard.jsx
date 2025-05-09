// src/components/cart/ProductCard.jsx
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
    <div className="flex bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg relative">
      <div 
        className="absolute top-3 right-3 bg-white/90 text-red-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white hover:scale-105 shadow-sm z-10"
        onClick={() => onRemove(product.id, product.name)}
      >
        🗑️
      </div>

      <div className="w-[150px] h-[150px] relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg sm:w-[110px] sm:h-[110px] xs:w-[100px] xs:h-[100px] xxs:w-[90px] xxs:h-[90px]">
        <img
          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 hover:scale-105"
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between sm:p-2.5">
        <div className="flex items-start mb-3 sm:mb-2">
          <div className="mr-3 mt-0.5 sm:mr-2">
            <input
              type="checkbox"
              className="appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer relative transition-all checked:bg-green-800 checked:border-green-800 after:content-['✓'] after:text-white after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:text-xs after:opacity-0 checked:after:opacity-100 sm:w-4.5 sm:h-4.5"
              checked={isSelected}
              onChange={onToggleSelect}
            />
          </div>
          <h3 className="text-base font-semibold text-gray-800 leading-tight sm:text-sm xxs:text-xs">{product.name}</h3>
        </div>
        <div className="flex flex-col gap-1.5 mb-3.5 sm:gap-1 sm:mb-2.5">
          <div className="flex items-center text-sm text-gray-600 sm:text-xs xxs:text-[11px]">
            <i className="mr-2 sm:mr-1.5">📏</i>
            {product.size}
          </div>
          <div className="flex items-center text-sm text-gray-600 sm:text-xs xxs:text-[11px]">
            <i className="mr-2 sm:mr-1.5">📦</i>
            {`Total barang: ${product.quantity}`}
          </div>
          <div className="flex items-center text-sm text-gray-600 sm:text-xs xxs:text-[11px]">
            <i className="mr-2 sm:mr-1.5">💰</i>
            {`Rp. ${product.price.toLocaleString()}`}
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto sm:pt-2">
          <div className="flex flex-col">
            <div className="text-lg font-bold text-green-800 mb-1.5 sm:text-base xxs:text-sm">
              {`Rp. ${totalPrice.toLocaleString()}`}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-1.5">
            <button
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 sm:w-6 sm:h-6 xxs:w-5.5 xxs:h-5.5 disabled:opacity-50"
              onClick={() => onUpdateQuantity(-1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="text-sm font-semibold w-8 text-center sm:text-xs sm:w-6 xxs:text-[11px] xxs:w-5.5">
              {quantity}
            </span>
            <button
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 sm:w-6 sm:h-6 xxs:w-5.5 xxs:h-5.5 disabled:opacity-50"
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