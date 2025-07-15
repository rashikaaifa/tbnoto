const API_URL = 'https://tbnoto19.rplrus.com/api/barang';
const CATEGORY_API_URL = 'https://tbnoto19-admin.rplrus.com/api/kategori';

// Fungsi untuk membersihkan URL gambar
const cleanImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Hapus duplikasi /storage/ jika ada
  const cleanedPath = imagePath.replace(/\/storage\/+/g, '/storage/');
  
  // Jika path sudah dimulai dengan https://, kembalikan apa adanya
  if (cleanedPath.startsWith('https://')) {
    return cleanedPath;
  }
  
  // Jika path dimulai dengan /storage/, tambahkan base URL
  if (cleanedPath.startsWith('/storage/')) {
    return `https://tbnoto19-admin.rplrus.com${cleanedPath}`;
  }
  
  // Jika path tidak dimulai dengan /storage/, tambahkan /storage/
  return `https://tbnoto19-admin.rplrus.com/storage/${cleanedPath}`;
};

// Fungsi untuk mengubah format data dari API ke format yang digunakan di UI
const formatProductData = (product) => {
  return {
    id: product.id,
    nama: product.nama_barang,
    kategori: product.kategori_id.toString(), // Konversi ke string untuk filter
    harga: parseFloat(product.harga),
    stok: product.stok,
    deskripsi: product.deskripsi,
    gambar: cleanImageUrl(product.foto_barang), // Gunakan fungsi pembersih URL
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