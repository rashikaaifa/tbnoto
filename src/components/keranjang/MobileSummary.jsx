// src/components/cart/MobileSummary.jsx
import React from 'react';

const MobileSummary = ({ summary, isExpanded, onToggle, disabled }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-50 p-4 rounded-t-2xl md:hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold text-green-800">
            {`Rp. ${summary.total.toLocaleString()}`}
          </div>
          <button
            className="text-green-800 text-sm font-medium flex items-center gap-1"
            onClick={onToggle}
          >
            Detail
            <span>{isExpanded ? '▲' : '▼'}</span>
          </button>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-48 py-1.5' : 'max-h-0'}`}>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm text-gray-600">Total Item</span>
            <span className="text-sm font-medium">{summary.totalItems}</span>
          </div>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium">{`Rp. ${summary.subtotal.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm text-gray-600">Ongkos Kirim (3%)</span>
            <span className="text-sm font-medium">
              {summary.shipping === 0 
                ? 'Gratis' 
                : `Rp. ${summary.shipping.toLocaleString()}`}
            </span>
          </div>  
        </div>
        <div className="mt-3.5">
          <button
            className="bg-green-800 hover:bg-green-900 text-white w-full rounded-lg py-3 px-5 text-base font-bold flex items-center justify-center gap-2 shadow-md shadow-green-800/20 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            <i className="text-lg">🛒</i>
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSummary;