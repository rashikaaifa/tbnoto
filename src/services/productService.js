// productService.js - Versi benar, rapi, dan siap tempel dengan API TB.NOTO19

const API_URL = 'https://tbnoto19-admin.rplrus.com/api/barang';
const CATEGORY_API_URL = 'https://tbnoto19-admin.rplrus.com/api/kategori';

// Fungsi untuk mengubah format data dari API ke format frontend
const formatProductData = (product) => {
  return {
    id: product.id,
    nama: product.nama_barang,
    kategori: product.kategori_id ? product.kategori_id.toString() : '',
    harga: parseFloat(product.harga),
    stok: product.stok,
    deskripsi: product.deskripsi,
    gambar: `https://tbnoto19-admin.rplrus.com/storage/${product.foto_barang}`,
    ukuran: product.ukuran, // tidak tersedia, dibiarkan kosong
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
    console.error('Error mengambil produk:', error);
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
    console.error('Error mengambil produk by ID:', error);
    throw error;
  }
};

// Mendapatkan semua kategori produk
export const getProductCategories = async () => {
  try {
    const response = await fetch(CATEGORY_API_URL);
    if (!response.ok) {
      throw new Error('Gagal mengambil data kategori');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error mengambil kategori:', error);
    throw error;
  }
};
