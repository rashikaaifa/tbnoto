import React from 'react';

const ProductCard = ({ 
  product, 
  isSelected, 
  quantity, 
  onToggleSelect, 
  onUpdateQuantity, 
  onRemove 
}) => {
  // No local state here anymore, we'll lift it up to parent
  
  // Calculate total price based on quantity
  const totalPrice = product.price * quantity;

  return (
    <div className="product-card">
      <div 
        className="delete-icon"
        onClick={() => onRemove(product.id, product.name)}
      >
        🗑️
      </div>

      <div className="product-image-container">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="card-body">
        <div className="card-header">
          <div className="checkbox-container">
            <input
              type="checkbox"
              className="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
            />
          </div>
          <h3 className="product-title">{product.name}</h3>
        </div>
        <div className="product-details">
          <div className="detail-item">
            <i>📏</i>
            {product.size}
          </div>
          <div className="detail-item">
            <i>📦</i>
            {`Total barang: ${product.quantity}`}
          </div>
          <div className="detail-item">
            <i>💰</i>
            {`Rp. ${product.price.toLocaleString()}`}
          </div>
        </div>
        <div className="card-footer">
          <div className="product-pricing">
            <div className="total-price">
              {`Rp. ${totalPrice.toLocaleString()}`}
            </div>
          </div>
          <div className="quantity-controls">
            <button
              className="quantity-btn"
              onClick={() => onUpdateQuantity(-1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity-value">
              {quantity}
            </span>
            <button
              className="quantity-btn"
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