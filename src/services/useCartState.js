// src/services/useCartState.js
// Mengelola state keranjang TANPA pernah mengubah stok produk di DB.
// Stok hanya akan berkurang oleh backend saat checkout.

import { useState, useEffect } from 'react';
import {
  getCartItems,
  removeFromCart,
  queueUpdateCartItemQuantity, // debounced PUT /api/cart/{id}
} from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

const DEBUG = false;

const getStock = (item) => {
  // stok total produk dari server
  if (typeof item?.stock === 'number') return item.stock;
  if (typeof item?.quantity === 'number') return item.quantity;
  return 0;
};

export const useCartState = () => {
  const [products, setProducts] = useState([]);         // array of cart items
  const [selectedProducts, setSelectedProducts] = useState({});
  const [quantities, setQuantities] = useState({});     // { cartItemId: qtyInCart }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isLoggedIn, isAuthLoading } = useAuth();

  const loadCart = async () => {
    if (!isLoggedIn || !token) {
      if (DEBUG) console.log('[useCartState] skip load (not logged in / no token)');
      setProducts([]); setQuantities({}); setSelectedProducts({}); setIsLoading(false);
      return;
    }
    setIsLoading(true); setError(null);
    try {
      const cartItems = await getCartItems(token);
      setProducts(cartItems);
      const initial = {};
      cartItems.forEach((it) => { initial[it.id] = it.cartQuantity > 0 ? it.cartQuantity : 1; });
      setQuantities(initial);
      if (DEBUG) console.log('[useCartState] loaded items:', cartItems);
    } catch (e) {
      setError(e.message || 'Gagal memuat keranjang');
      setProducts([]); setQuantities({});
      if (DEBUG) console.error('[useCartState] load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLoggedIn, isAuthLoading]);

  const toggleProductSelection = (id) => {
    setSelectedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /**
   * Update quantity cart item (debounced):
   * - Tidak mengubah stok produk di DB dari sisi client.
   * - Batasi qty <= stok total dari server.
   */
  const updateQuantity = (id, amount) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    const currentQty = quantities[id] || 1;
    const desired = Math.max(1, currentQty + amount);

    // Batas maksimum = stok total dari server
    const totalStock = getStock(item);
    const updatedQty = Math.min(desired, totalStock);
    if (updatedQty === currentQty) return;

    // Optimistic UI (hanya qty)
    setQuantities((prev) => ({ ...prev, [id]: updatedQty }));

    // Simpan ke server (debounced)
    queueUpdateCartItemQuantity(id, updatedQty, token);
  };

  const removeProduct = async (id) => {
    const item = products.find((p) => p.id === id);
    const qty = quantities[id] || item?.cartQuantity || 0;

    try {
      await removeFromCart(id, token);
      // Hapus item dari state (tidak ada pengembalian stok ke DB dari client)
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedProducts((prev) => { const n = { ...prev }; delete n[id]; return n; });
      setQuantities((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } catch (e) {
      setError(e.message || 'Gagal menghapus produk');
      if (DEBUG) console.error('[useCartState] removeProduct error:', e);
    }
  };

  const calculateSummary = () => {
    let totalItems = 0, subtotal = 0;
    products.forEach((p) => {
      if (selectedProducts[p.id]) {
        const qty = quantities[p.id] || 1;
        totalItems += qty;
        subtotal += (p.price || 0) * qty;
      }
    });
    const shipping = subtotal > 1000000 ? 0 : Math.round(subtotal * 0.03);
    return { totalItems, subtotal, shipping, total: subtotal + shipping };
  };

  return {
    products,
    selectedProducts,
    quantities,
    isLoading,
    error,
    toggleProductSelection,
    updateQuantity,
    removeProduct,
    calculateSummary,
    refreshCart: loadCart,
  };
};
