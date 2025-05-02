import React, { useState, useEffect } from 'react';
import ProductCard from '../components/keranjang/ProductCard';
import CartSummary from '../components/keranjang/CartSummary';
import MobileSummary from '../components/keranjang/MobileSummary';
import DeleteConfirmation from '../services/DeleteConfirmation';
import { useCartState } from '../services/useCartState';
import productData from '../data/products';
import '../style/Keranjang.css';

const Keranjang = () => {
  const { 
    products, 
    selectedProducts, 
    quantities, 
    toggleProductSelection, 
    updateQuantity, 
    removeProduct, 
    calculateSummary 
  } = useCartState(productData);
  
  const [isMobileSummaryExpanded, setIsMobileSummaryExpanded] = useState(false);
  // State untuk konfirmasi hapus
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });

  const toggleMobileSummary = () => {
    setIsMobileSummaryExpanded(!isMobileSummaryExpanded);
  };

  // Handle menampilkan konfirmasi hapus
  const handleShowDeleteConfirmation = (productId, productName) => {
    setDeleteConfirmation({
      isOpen: true,
      productId,
      productName
    });
  };

  // Handle konfirmasi hapus
  const handleConfirmDelete = () => {
    if (deleteConfirmation.productId) {
      removeProduct(deleteConfirmation.productId);
      setDeleteConfirmation({
        isOpen: false,
        productId: null,
        productName: ''
      });
    }
  };

  // Handle batal hapus
  const handleCancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      productId: null,
      productName: ''
    });
  };

  const summary = calculateSummary();

  return (
    <div className="keranjang-page" style={{ paddingTop: "80px" }}> {/* MODIFIKASI: Tambahkan padding-top untuk memberikan ruang dibawah navbar */}
      <div className="container">
        <div className="page-header"> {/* Menggunakan class asli tanpa perubahan lain */}
          <h1 className="page-title">Keranjang</h1>
          <p className="page-subtitle">Produk berada di keranjang maksimal selama 2 hari</p>
        </div>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmation.isOpen && (
          <DeleteConfirmation 
            productName={deleteConfirmation.productName}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
        
        <div className="desktop-layout">
          <div className="products-container">
            {products.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p className="empty-cart-text">Keranjang Anda kosong</p>
                <button className="shop-now-button">Belanja Sekarang</button>
              </div>
            ) : (
              products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={!!selectedProducts[product.id]}
                  quantity={quantities[product.id] || 1}
                  onToggleSelect={() => toggleProductSelection(product.id)}
                  onUpdateQuantity={(amount) => updateQuantity(product.id, amount)}
                  onRemove={handleShowDeleteConfirmation}
                />
              ))
            )}
          </div>
          <CartSummary
            summary={summary}
            disabled={summary.totalItems === 0}
          />
        </div>
        {/* Mobile summary that shows at the bottom on small screens */}
        <MobileSummary
          summary={summary}
          isExpanded={isMobileSummaryExpanded}
          onToggle={toggleMobileSummary}
          disabled={summary.totalItems === 0}
        />
      </div>
    </div>
  );
};

export default Keranjang;