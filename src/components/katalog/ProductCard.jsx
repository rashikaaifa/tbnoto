// ProductCard.jsx - menambahkan navigasi
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { id, nama, ukuran, harga, satuan, gambar } = product;

  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          <img src={gambar} alt={nama} className="product-image" />
        </div>
        <div className="product-info">
          <h3 className="product-title">{nama}</h3>
          <p className="product-size">{ukuran}</p>
          <div className="product-footer">
            <p className="product-price">Rp {harga.toLocaleString()}<span className="price-unit">/{satuan}</span></p>
            <button className="add-to-cart-btn" onClick={(e) => {
              e.preventDefault(); // Mencegah navigasi saat tombol diklik
              // Logic untuk menambahkan ke keranjang
            }}>
              Tambah
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;