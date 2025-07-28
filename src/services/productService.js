// productService.js - Versi diperbaiki untuk masalah keranjang

const API_URL = 'https://tbnoto19-admin.rplrus.com/api/barang';
const CATEGORY_API_URL = 'https://tbnoto19-admin.rplrus.com/api/kategori';
const CART_API_URL = 'https://tbnoto19-admin.rplrus.com/api/cart';

// Helper function to get auth headers
const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Fungsi untuk mengubah format data dari API ke format frontend
const formatProductData = (product) => {
  return {
    id: product.id,
    nama: product.nama_barang,
    kategori: product.kategori_id ? product.kategori_id.toString() : '',
    harga: parseFloat(product.harga),
    stok: product.stok,
    deskripsi: product.deskripsi,
    gambar: `https://tbnoto19-admin.rplrus.com/storage/${product.foto_barang.replace(/^storage\//, '')}`,
    ukuran: '', // tidak tersedia, dibiarkan kosong
    created_at: product.created_at,
    updated_at: product.updated_at
  };
};

// PERBAIKAN UTAMA: Fungsi untuk mengubah format data keranjang dari API ke format frontend
const formatCartData = (cartItem) => {
  console.log('Raw cart item from API:', cartItem); // Debug log
  
  // Pastikan barang data tersedia
  if (!cartItem.barang_id) {
    console.error('Cart item missing barang_id:', cartItem);
    return null;
  }

  // Format berdasarkan struktur data yang sebenarnya dari database
  return {
    id: cartItem.id, // ID cart item (untuk update/delete)
    name: cartItem.nama_barang || cartItem.barang?.nama_barang || `Produk ID ${cartItem.barang_id}`,
    price: parseFloat(cartItem.harga_satuan || cartItem.barang?.harga || 0),
    image: cartItem.foto_barang 
      ? `https://tbnoto19-admin.rplrus.com/storage/${cartItem.foto_barang.replace(/^storage\//, '')}`
      : (cartItem.barang?.foto_barang 
          ? `https://tbnoto19-admin.rplrus.com/storage/${cartItem.barang.foto_barang.replace(/^storage\//, '')}`
          : '/placeholder-image.jpg'),
    size: cartItem.ukuran || cartItem.barang?.ukuran || '', // Ukuran produk jika ada
    quantity: cartItem.stok || cartItem.barang?.stok || 999, // Stock produk yang tersedia
    cartQuantity: cartItem.quantity, // Quantity yang dipilih user di keranjang
    productId: cartItem.barang_id, // ID produk asli
    totalPrice: parseFloat(cartItem.total_harga || 0) // Total harga untuk item ini
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

// CART API FUNCTIONS

// Menambahkan item ke keranjang
export const addToCart = async (productId, quantity = 1, token) => {
  try {
    console.log('Adding to cart:', { productId, quantity });
    
    const requestBody = {
      barang_id: productId,
      quantity: quantity
    };
    
    console.log('Request body:', requestBody);
    console.log('Auth headers:', getAuthHeaders(token));
    
    const response = await fetch(CART_API_URL, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);

    // Log response text for debugging
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      let errorMessage = 'Gagal menambahkan ke keranjang';
      
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        console.log('Could not parse error response as JSON');
        errorMessage = `HTTP ${response.status}: ${responseText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response JSON:', parseError);
      throw new Error('Invalid response format from server');
    }
    
    console.log('Success response:', data);
    return data;
  } catch (error) {
    console.error('Error menambahkan ke keranjang:', error);
    throw error;
  }
};

// PERBAIKAN UTAMA: Mendapatkan semua item di keranjang
export const getCartItems = async (token) => {
  try {
    console.log('Fetching cart items with token:', token ? 'Token exists' : 'No token');
    
    const response = await fetch(CART_API_URL, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
    
    console.log('Cart response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token tidak valid, silakan login ulang');
      }
      throw new Error(`Gagal mengambil data keranjang (HTTP ${response.status})`);
    }
    
    const responseText = await response.text();
    console.log('Cart response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing cart response:', parseError);
      throw new Error('Format response tidak valid');
    }
    
    console.log('Parsed cart data:', data);
    
    // Handle berbagai format response
    let cartItems = [];
    if (Array.isArray(data)) {
      cartItems = data;
    } else if (data.data && Array.isArray(data.data)) {
      cartItems = data.data;
    } else if (data.cart && Array.isArray(data.cart)) {
      cartItems = data.cart;
    } else if (data.items && Array.isArray(data.items)) {
      cartItems = data.items;
    } else {
      console.warn('Unexpected cart data format:', data);
      cartItems = [];
    }
    
    console.log('Cart items to format:', cartItems);
    
    // Filter out null items dan format data
    const formattedItems = cartItems
      .map(formatCartData)
      .filter(item => item !== null); // Remove null items
    
    console.log('Formatted cart items:', formattedItems);
    
    return formattedItems;
  } catch (error) {
    console.error('Error mengambil keranjang:', error);
    throw error;
  }
};

// Update item di keranjang
export const updateCartItem = async (cartId, quantity, token) => {
  try {
    console.log('Updating cart item:', { cartId, quantity });
    
    const response = await fetch(`${CART_API_URL}/${cartId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        quantity: quantity
      })
    });

    if (!response.ok) {
      throw new Error(`Gagal mengupdate keranjang (HTTP ${response.status})`);
    }
    
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing update response:', parseError);
      throw new Error('Format response tidak valid');
    }
    
    console.log('Update cart response:', data);
    return data;
  } catch (error) {
    console.error('Error mengupdate keranjang:', error);
    throw error;
  }
};

// Menghapus item dari keranjang
export const removeFromCart = async (cartId, token) => {
  try {
    console.log('Removing cart item:', cartId);
    
    const response = await fetch(`${CART_API_URL}/${cartId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });

    if (!response.ok) {
      throw new Error(`Gagal menghapus dari keranjang (HTTP ${response.status})`);
    }
    
    console.log('Remove cart response status:', response.status);
    return true;
  } catch (error) {
    console.error('Error menghapus dari keranjang:', error);
    throw error;
  }
};