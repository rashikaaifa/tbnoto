// ProductPage.jsx - Improved UI
import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/katalog/ProductGrid';
import SearchBar from '../components/katalog/SearchBar';
import FilterSelector from '../components/katalog/FilterSelector';
import { getProducts, getProductCategories } from '../services/productService';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Ambil data produk
        const productsData = await getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Ambil data kategori
        const categoriesData = await getProductCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error saat mengambil data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const filterProducts = () => {
    let results = [...products];

    if (searchTerm) {
      results = results.filter(product =>
        product.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter(product =>
        product.kategori === selectedCategory
      );
    }

    setFilteredProducts(results);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-600 text-lg">
        Memuat produk...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 mt-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Semua Produk
        </h1>
        <p className="text-lg text-gray-600">
          Katalog lengkap produk bahan bangunan
        </p>
      </header>

      <div className="flex justify-between items-center mb-6 gap-4">
        <SearchBar onSearch={handleSearch} />
        <FilterSelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
};

export default ProductPage;