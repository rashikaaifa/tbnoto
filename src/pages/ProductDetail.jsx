import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import '../styles/ProductDetail.css';

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
    return <div className="simple-loading">Memuat detail produk...</div>;
  }

  if (!product) {
    return <div className="simple-error">Produk tidak ditemukan</div>;
  }

  return (
    <div className="simple-detail-container">
      <div className="simple-back-button">
        <Link to="/" className="back-link">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Detail Produk</span>
        </Link>
      </div>

      <div className="simple-product-wrapper">
        <div className="simple-product-image">
          <img src={product.gambar} alt={product.nama} />
        </div>

        <div className="simple-product-content">
          <h1 className="simple-product-title">{product.nama}</h1>
          <p className="simple-product-dimension">{product.ukuran}</p>
          
          <p className="simple-product-description">
            {product.nama} {product.ukuran} – Kayu lapis berkualitas, kuat, dan serbaguna.
            Cocok untuk furniture, konstruksi, dan dekorasi.
          </p>

          <div className="simple-order-box">
            <h2 className="simple-order-title">BUAT PESANAN</h2>
            
            <div className="simple-quantity-control">
              <button 
                className="simple-qty-btn"
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input 
                type="text" 
                value={quantity} 
                readOnly 
                className="simple-qty-input"
              />
              <button 
                className="simple-qty-btn"
                onClick={handleIncreaseQuantity}
                disabled={quantity >= product.stok}
              >
                +
              </button>
              <span className="simple-stock">Stok: {product.stok}</span>
            </div>

            <div className="simple-price-section">
              <p className="simple-total-label">Total harga:</p>
              <p className="simple-total-price">Rp{calculateTotalPrice().toLocaleString()}</p>
            </div>

            <div className="simple-action-buttons">
              <button className="simple-cart-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Masukkan Keranjang
              </button>
              <button className="simple-buy-btn">Beli</button>
            </div>

            <button className="simple-contact-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
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