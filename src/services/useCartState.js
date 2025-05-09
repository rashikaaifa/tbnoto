// src/services/useCartState.js
import { useState, useEffect } from 'react';

export const useCartState = (initialProducts) => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [quantities, setQuantities] = useState({});

  // Initialize quantities
  useEffect(() => {
    const initialQuantities = {};
    products.forEach(product => {
      initialQuantities[product.id] = product.quantity; 
    });
    setQuantities(initialQuantities);
  }, []);

  const toggleProductSelection = (id) => {
    setSelectedProducts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const updateQuantity = (id, amount) => {
    setQuantities(prev => {
      const newQuantity = Math.max(1, (prev[id] || 1) + amount);
      // Limit to available product quantity
      const product = products.find(p => p.id === id);
      const maxQuantity = product ? product.quantity : 1;
      return {
        ...prev,
        [id]: Math.min(newQuantity, maxQuantity)
      };
    });
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    // Clean up state for this product
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
  };

  // Calculate summary information
  const calculateSummary = () => {
    let totalItems = 0;
    let subtotal = 0;
    let shipping = 0;

    products.forEach(product => {
      if (selectedProducts[product.id]) {
        const quantity = quantities[product.id] || 1;
        totalItems += quantity;
        subtotal += product.price * quantity;
      }
    });

    // Calculate shipping (3% of subtotal)
    shipping = subtotal * 0.03;

    // Free shipping for orders over 1,000,000
    if (subtotal > 1000000) {
      shipping = 0;
    }

    const total = subtotal + shipping;

    return {
      totalItems,
      subtotal,
      shipping,
      total
    };
  };

  return {
    products,
    selectedProducts,
    quantities,
    toggleProductSelection,
    updateQuantity,
    removeProduct,
    calculateSummary
  };
};