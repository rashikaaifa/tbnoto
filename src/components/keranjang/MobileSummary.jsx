// src/components/cart/MobileSummary.jsx
import React from 'react';

const MobileSummary = ({ summary, isExpanded, onToggle, disabled }) => {
  return (
    <div className="mobile-summary">
      <div className="mobile-summary-content">
        <div className="mobile-summary-header">
          <div className="total-value">
            {`Rp. ${summary.total.toLocaleString()}`}
          </div>
          <button
            className="mobile-summary-toggle"
            onClick={onToggle}
          >
            Detail
            <span>{isExpanded ? '▲' : '▼'}</span>
          </button>
        </div>
        <div className={`mobile-summary-details ${isExpanded ? 'expanded' : ''}`}>
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
    </div>
  );
};

export default MobileSummary;