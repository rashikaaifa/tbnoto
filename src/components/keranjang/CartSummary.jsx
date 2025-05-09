// src/components/cart/CartSummary.jsx
import React from 'react';

const CartSummary = ({ summary, disabled }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 lg:sticky lg:top-6">
      <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
      <div className="flex justify-between mb-3">
        <span className="text-sm text-gray-600">Total Item</span>
        <span className="text-sm font-medium">{summary.totalItems}</span>
      </div>
      <div className="flex justify-between mb-3">
        <span className="text-sm text-gray-600">Subtotal</span>
        <span className="text-sm font-medium">{`Rp. ${summary.subtotal.toLocaleString()}`}</span>
      </div>
      <div className="flex justify-between mb-3">
        <span className="text-sm text-gray-600">Ongkos Kirim (3%)</span>
        <span className="text-sm font-medium">
          {summary.shipping === 0 
            ? 'Gratis' 
            : `Rp. ${summary.shipping.toLocaleString()}`}
        </span>
      </div>
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-bold text-green-800">{`Rp. ${summary.total.toLocaleString()}`}</span>
      </div>
      <div className="mt-4">
        <button
          className="bg-green-800 hover:bg-green-900 text-white w-full rounded-lg py-3.5 px-6 text-base font-bold flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <i className="text-lg">🛒</i>
          Beli Sekarang
        </button>
      </div>
    </div>
  );
};

export default CartSummary;