import React, { useState, useEffect } from 'react';
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
    <div className="font-['Poppins'] bg-[#f9f6e9] text-gray-800 leading-relaxed pt-20">
      <div className="w-full max-w-6xl mx-auto px-5 pb-20 sm:px-4 sm:pb-24">
        <div className="mb-6 pb-4 border-b-2 border-gray-200 sm:mb-4 sm:pb-3">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:text-xl sm:mb-1">Keranjang</h1>
          <p className="text-base text-gray-600 sm:text-sm">Produk berada di keranjang maksimal selama 2 hari</p>
        </div>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmation.isOpen && (
          <DeleteConfirmation 
            productName={deleteConfirmation.productName}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 lg:col-span-2 mb-20 sm:mb-20">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl text-gray-500 mb-4">🛒</div>
                <p className="text-lg font-medium text-gray-500 mb-6">Keranjang Anda kosong</p>
                <button className="bg-green-800 hover:bg-green-900 text-white py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-colors">
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