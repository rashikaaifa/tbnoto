// src/components/cart/CartSummary.jsx
import React from 'react';

const CartSummary = ({ summary, disabled }) => {
  return (
    <div className="summary-section">
      <h2 className="summary-title">Ringkasan Pesanan</h2>
      <div className="summary-item">
        <span className="summary-key">Total Item</span>
        <span className="summary-value">{summary.totalItems}</span>
      </div>
      <div className="summary-item">
        <span className="summary-key">Subtotal</span>
        <span className="summary-value">{`Rp. ${summary.subtotal.toLocaleString()}`}</span>
      </div>
      <div className="summary-item">
        <span className="summary-key">Ongkos Kirim (3%)</span>
        <span className="summary-value">
          {summary.shipping === 0 
            ? 'Gratis' 
            : `Rp. ${summary.shipping.toLocaleString()}`}
        </span>
      </div>
      <div className="summary-total">
        <span className="total-text">Total</span>
        <span className="total-value">{`Rp. ${summary.total.toLocaleString()}`}</span>
      </div>
      <div className="buy-button-container">
        <button
          className="buy-button"
          disabled={disabled}
        >
          <i>🛒</i>
          Beli Sekarang
        </button>
      </div>
    </div>
  );
};

export default CartSummary;