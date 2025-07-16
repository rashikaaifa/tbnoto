
// productService.js - Perbarui dengan service untuk kategori
const API_URL = 'https://tbnoto19-admin.rplrus.com/api/barang';
const CATEGORY_API_URL = 'https://tbnoto19-admin.rplrus.com/api/kategori';

// Fungsi untuk mengubah format data dari API ke format yang digunakan di UI
const formatProductData = (product) => {
  return {
    id: product.id,
    nama: product.nama_barang,
    kategori: product.kategori_id.toString(), // Konversi ke string untuk filter
    harga: parseFloat(product.harga),
    stok: product.stok,
    deskripsi: product.deskripsi,
    gambar: `https://tbnoto19-admin.rplrus.com/storage/${product.foto_barang}`,
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

// Mendapatkan kategori produk dari API
export const getProductCategories = async () => {
  try {
    const response = await fetch(CATEGORY_API_URL);
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data kategori');
    }
    
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};