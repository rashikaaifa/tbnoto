// src/services/productService.js
const API_URL = 'https://tbnoto19.rplrus.com/api/barang';

// Fungsi untuk mengubah format data dari API ke format yang digunakan di UI
const formatProductData = (product) => {
  return {
    id: product.id,
    nama: product.nama_barang,
    kategori: product.kategori_id.toString(), // Konversi ke string untuk filter
    harga: parseFloat(product.harga),
    stok: product.stok,
    deskripsi: product.deskripsi,
    gambar: `https://tbnoto19.rplrus.com/storage/${product.foto_barang}`,
    ukuran: '', // Jika ukuran tidak ada di API, bisa diisi dari deskripsi atau dibiarkan kosong
    created_at: product.created_at,
    updated_at: product.updated_at
  };
};

// Mendapatkan semua produk
export const getProducts = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data produk');
    }
    
    const data = await response.json();
    return data.map(formatProductData);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Mendapatkan produk berdasarkan ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Produk tidak ditemukan');
    }
    
    const data = await response.json();
    return formatProductData(data);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Mendapatkan kategori produk
export const getProductCategories = async () => {
  try {
    const products = await getProducts();
    // Mendapatkan kategori unik dari produk
    const categories = [...new Set(products.map(product => product.kategori))];
    return categories;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};