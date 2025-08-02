// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, addToCart, adjustProductStock } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

// Simple Notification Component - inline
const SimpleNotification = ({ show, type, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);
  if (!show) return null;

  const styles = type === 'success' ? 'bg-green-500 text-white'
              : type === 'error'   ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className={`${styles} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm`}>
        <span className="text-xl font-bold">{icon}</span>
        <span className="text-sm font-medium flex-1">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors ml-2 text-lg font-bold">×</button>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { isLoggedIn, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: 'success', message: '' });

  const showNotification = (type, message) => setNotification({ show: true, type, message });
  const hideNotification = () => setNotification((prev) => ({ ...prev, show: false }));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = parseInt(id, 10);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (e) {
        showNotification('error', 'Gagal memuat detail produk');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleIncreaseQuantity = () => {
    if (!product) return;
    if (quantity < product.stok) setQuantity(quantity + 1);
    else showNotification('error', `Maksimal ${product.stok} item tersedia`);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const calculateTotalPrice = () => (product ? product.harga * quantity : 0);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isLoggedIn) { showNotification('error', 'Silakan login terlebih dahulu untuk berbelanja'); return; }
    if (product.stok === 0) { showNotification('error', 'Maaf, stok produk habis'); return; }
    if (quantity > product.stok) { showNotification('error', `Stok hanya tersisa ${product.stok} item`); setQuantity(product.stok); return; }

    setIsAddingToCart(true);
    try {
      // Tambah ke keranjang saja — stok DB tidak disentuh di frontend
      await addToCart(product.id, quantity, token);

      showNotification('success', `${product.nama} berhasil ditambahkan ke keranjang!`);
      // Opsional: reset qty ke 1 agar UX enak
      setQuantity(1);
    } catch (e) {
      showNotification('error', e.message || 'Gagal menambahkan ke keranjang. Silakan coba lagi.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-60 text-gray-600 text-lg">Memuat detail produk...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Produk tidak ditemukan</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">Kembali ke halaman produk</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 mt-20">
      <div className="mb-6">
        <Link to="/katalog" className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Kembali ke Katalog
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row">
        {/* Gambar */}
        <div className="w-full lg:w-1/2 p-6">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img src={product.gambar} alt={product.nama} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">{product.nama}</h1>
          <p className="text-lg text-gray-600 mb-4">{product.ukuran}</p>
          <p className="text-gray-700 mb-8">{product.deskripsi}</p>

          <div className="bg-gray-50 rounded-lg p-6 mt-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">BUAT PESANAN</h2>

            <div className="flex items-center mb-6">
              <button onClick={handleDecreaseQuantity} disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center rounded bg-gray-200 text-gray-700 text-xl font-medium disabled:opacity-50">−</button>
              <span className="mx-6 font-medium text-lg">{quantity}</span>
              <button onClick={handleIncreaseQuantity} disabled={quantity >= product.stok}
                className="w-10 h-10 flex items-center justify-center rounded bg-gray-200 text-gray-700 text-xl font-medium disabled:opacity-50">+</button>
              <span className="ml-auto text-gray-500">Stok: {product.stok}</span>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700 font-medium">Total harga:</span>
              <span className="text-xl font-bold text-gray-900">Rp{calculateTotalPrice().toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button onClick={handleAddToCart} disabled={isAddingToCart || product.stok === 0 || !isLoggedIn}
                className="flex justify-center items-center bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {!isLoggedIn ? 'Login untuk Berbelanja' :
                 isAddingToCart ? 'Menambahkan...' :
                 product.stok === 0 ? 'Stok Habis' : 'Masukkan Keranjang'}
              </button>
              <button disabled={!isLoggedIn || product.stok === 0}
                className="bg-green-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {!isLoggedIn ? 'Login Dulu' : product.stok === 0 ? 'Habis' : 'Beli'}
              </button>
            </div>

            <button className="w-full flex justify-center items-center border border-gray-300 bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hubungi penjual
            </button>
          </div>
        </div>
      </div>

      <SimpleNotification show={notification.show} type={notification.type} message={notification.message} onClose={hideNotification} />
    </div>
  );
};

export default ProductDetail;
