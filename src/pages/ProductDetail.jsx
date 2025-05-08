// ProductDetail.jsx - Improved UI
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = parseInt(id);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stok) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateTotalPrice = () => {
    return product ? product.harga * quantity : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-600 text-lg">
        Memuat detail produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Produk tidak ditemukan</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
          Kembali ke halaman produk
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 mt-20">
      <div className="mb-6">
        <Link to="/katalog" className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali ke Katalog
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row">
        {/* Gambar Produk */}
        <div className="w-full lg:w-1/2 p-6">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.gambar}
              alt={product.nama}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Informasi Produk */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">{product.nama}</h1>
          <p className="text-lg text-gray-600 mb-4">{product.ukuran}</p>

          <p className="text-gray-700 mb-8">
            {product.deskripsi}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mt-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">BUAT PESANAN</h2>

            <div className="flex items-center mb-6">
              <button
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center rounded bg-gray-200 text-gray-700 text-xl font-medium disabled:opacity-50"
              >
                −
              </button>
              <span className="mx-6 font-medium text-lg">{quantity}</span>
              <button
                onClick={handleIncreaseQuantity}
                disabled={quantity >= product.stok}
                className="w-10 h-10 flex items-center justify-center rounded bg-gray-200 text-gray-700 text-xl font-medium disabled:opacity-50"
              >
                +
              </button>
              <span className="ml-auto text-gray-500">Stok: {product.stok}</span>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700 font-medium">Total harga:</span>
              <span className="text-xl font-bold text-gray-900">Rp{calculateTotalPrice().toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button className="flex justify-center items-center bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Masukkan Keranjang
              </button>
              <button className="bg-green-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-800 transition">
                Beli
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
    </div>
  );
};

export default ProductDetail;