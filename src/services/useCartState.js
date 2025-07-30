// src/services/useCartState.js
// Mengelola state keranjang + sinkron stok real-time (buffered)

import { useState, useEffect } from 'react';
import {
  getCartItems,
  removeFromCart,
  queueUpdateCartItemQuantity, // debounced PUT /api/cart/{id}
  queueAdjustProductStock,     // debounced set stok barang
} from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

const DEBUG = false;

const getStock = (item) => {
  if (typeof item?.stock === 'number') return item.stock;
  if (typeof item?.quantity === 'number') return item.quantity;
  return 0;
};

const patchProductStockInState = (items, cartItemId, delta) => {
  return items.map((p) =>
    p.id === cartItemId
      ? { ...p, stock: (typeof p.stock === 'number' ? p.stock : getStock(p)) - delta }
      : p
  );
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
   * Update quantity cart item (delta logic, debounced):
   * delta > 0 → stok DB berkurang; delta < 0 → stok DB bertambah.
   * PUT ke /api/cart/{id} dan set stok di /api/barang/{productId} dilakukan via antrian (queue).
   */
  const updateQuantity = (id, amount) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    const currentQty = quantities[id] || 1;
    const desired = Math.max(1, currentQty + amount);

    const availableStock = getStock(item);
    const maxAllowed = currentQty + availableStock;
    const updatedQty = Math.min(desired, maxAllowed);
    const delta = updatedQty - currentQty;
    if (delta === 0) return;

    // Optimistic UI
    setQuantities((prev) => ({ ...prev, [id]: updatedQty }));
    setProducts((prev) => patchProductStockInState(prev, id, delta));

    // 1) Queue update keranjang (debounced, non-blocking)
    queueUpdateCartItemQuantity(id, updatedQty, token);

    // 2) Queue adjust stok produk (debounced, non-blocking)
    if (item.productId) queueAdjustProductStock(item.productId, -delta, token);
  };

  const removeProduct = async (id) => {
    const item = products.find((p) => p.id === id);
    const qty = quantities[id] || item?.cartQuantity || 0;

    try {
      await removeFromCart(id, token);
      // Kembalikan stok (dibuffer)
      if (item?.productId && qty > 0) queueAdjustProductStock(item.productId, +qty, token);

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
    const shipping = subtotal > 1000000 ? 0 : subtotal * 0.03;
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
