// useCartState.js - Diperbaiki untuk mengatasi masalah keranjang kosong

import { useState, useEffect } from 'react';
import { getCartItems, removeFromCart, updateCartItem } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

export const useCartState = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isLoggedIn } = useAuth();

  // PERBAIKAN: Ambil data keranjang saat komponen mount
  useEffect(() => {
    const fetchCartItems = async () => {
      // Jika user tidak login, set loading false dan return
      if (!isLoggedIn || !token) {
        setIsLoading(false);
        setProducts([]);
        setQuantities({});
        setSelectedProducts({});
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Starting to fetch cart items...');
        const cartItems = await getCartItems(token);
        
        console.log('Received cart items:', cartItems);
        
        // Pastikan cartItems adalah array
        if (!Array.isArray(cartItems)) {
          console.error('Cart items is not an array:', cartItems);
          throw new Error('Data keranjang tidak valid');
        }

        setProducts(cartItems);

        // Set initial quantities berdasarkan data dari API
        const initialQuantities = {};
        cartItems.forEach(item => {
          initialQuantities[item.id] = item.cartQuantity || 1;
        });
        setQuantities(initialQuantities);
        
        console.log('Cart loaded successfully:', {
          itemCount: cartItems.length,
          quantities: initialQuantities
        });
        
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err.message || 'Gagal memuat keranjang');
        setProducts([]);
        setQuantities({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [token, isLoggedIn]); // Dependency pada token dan isLoggedIn

  const toggleProductSelection = (id) => {
    setSelectedProducts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const updateQuantity = async (id, amount) => {
    const product = products.find(p => p.id === id);
    if (!product) {
      console.error('Product not found:', id);
      return;
    }

    const currentQuantity = quantities[id] || 1;
    const newQuantity = Math.max(1, currentQuantity + amount);
    const maxQuantity = product.quantity || 1;
    const updatedQuantity = Math.min(newQuantity, maxQuantity);

    // Update UI immediately for better UX
    setQuantities(prev => ({
      ...prev,
      [id]: updatedQuantity
    }));

    try {
      console.log('Updating quantity:', { id, updatedQuantity });
      await updateCartItem(id, updatedQuantity, token);
      console.log('Quantity updated successfully');
    } catch (err) {
      console.error('Failed to update quantity:', err);
      // Revert UI change if API call fails
      setQuantities(prev => ({
        ...prev,
        [id]: currentQuantity
      }));
      setError('Gagal memperbarui jumlah: ' + (err.message || 'Unknown error'));
    }
  };

  const removeProduct = async (id) => {
    try {
      console.log('Removing product:', id);
      await removeFromCart(id, token);
      
      // Update state after successful removal
      setProducts(prev => prev.filter(product => product.id !== id));
      setSelectedProducts(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      setQuantities(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      
      console.log('Product removed successfully');
    } catch (err) {
      console.error('Failed to remove product:', err);
      setError('Gagal menghapus produk: ' + (err.message || 'Unknown error'));
    }
  };

  const calculateSummary = () => {
    let totalItems = 0;
    let subtotal = 0;
    let shipping = 0;

    if (Array.isArray(products)) {
      products.forEach(product => {
        if (selectedProducts[product.id]) {
          const quantity = quantities[product.id] || 1;
          totalItems += quantity;
          subtotal += product.price * quantity;
        }
      });
    }

    // Calculate shipping (3% if subtotal < 1,000,000, free otherwise)
    shipping = subtotal > 1000000 ? 0 : subtotal * 0.03;
    const total = subtotal + shipping;

    return {
      totalItems,
      subtotal,
      shipping,
      total
    };
  };

  const refreshCart = async () => {
    if (!isLoggedIn || !token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Refreshing cart...');
      const cartItems = await getCartItems(token);
      
      if (!Array.isArray(cartItems)) {
        throw new Error('Data keranjang tidak valid');
      }

      setProducts(cartItems);
      
      const initialQuantities = {};
      cartItems.forEach(item => {
        initialQuantities[item.id] = item.cartQuantity || 1;
      });
      setQuantities(initialQuantities);
      
      console.log('Cart refreshed successfully');
    } catch (err) {
      console.error('Error refreshing cart:', err);
      setError(err.message || 'Gagal menyegarkan keranjang');
    } finally {
      setIsLoading(false);
    }
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
    refreshCart
  };
};