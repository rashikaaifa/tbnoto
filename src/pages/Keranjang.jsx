// Keranjang.jsx yang diperbaiki untuk Mobile View
import React, { useState } from 'react';
import ProductCard from '../components/keranjang/ProductCard';
import CartSummary from '../components/keranjang/CartSummary';
import MobileSummary from '../components/keranjang/MobileSummary';
import DeleteConfirmation from '../services/DeleteConfirmation';
import { useCartState } from '../services/useCartState';
import productData from '../data/products';

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
    <div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
        <header className="mb-3 sm:mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-0 md:text-2xl lg:text-3xl">Keranjang</h1>
          <p className="text-xs text-gray-600 mt-0.5 sm:text-sm">Produk berada di keranjang maksimal selama 2 hari</p>
        </header>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmation.isOpen && (
          <DeleteConfirmation 
            productName={deleteConfirmation.productName}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
          <div className="flex flex-col gap-2 sm:gap-3 lg:col-span-2 mb-20 sm:mb-20">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-lg shadow-sm my-4">
                <div className="text-4xl text-gray-400 mb-3">🛒</div>
                <p className="text-sm font-medium text-gray-500 mb-4">Keranjang Anda kosong</p>
                <button className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors">
                  Belanja Sekarang
                </button>
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
          <div className="hidden lg:block">
            <CartSummary
              summary={summary}
              disabled={summary.totalItems === 0}
            />
          </div>
        </div>
        
        {/* Mobile summary yang ditampilkan di bagian bawah pada layar kecil */}
        <div className="block lg:hidden">
          <MobileSummary
            summary={summary}
            isExpanded={isMobileSummaryExpanded}
            onToggle={toggleMobileSummary}
            disabled={summary.totalItems === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Keranjang;