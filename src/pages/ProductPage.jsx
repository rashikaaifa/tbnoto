import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/katalog/ProductGrid';
import SearchBar from '../components/katalog/SearchBar';
import FilterSelector from '../components/katalog/FilterSelector';
import { getProducts } from '../services/productService';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
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
      <div className="flex justify-center items-center h-[300px] text-gray-600 text-lg sm:h-[200px] sm:text-base">
        Memuat produk...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-5 sm:px-3 sm:py-3 mt-24">
      <header className="mb-6 sm:mb-4">
        <h1 className="text-[28px] font-bold text-gray-900 mb-2 sm:text-[22px] sm:mb-1">
          Semua Produk
        </h1>
        <p className="text-[16px] text-gray-600 sm:text-sm">
          Katalog lengkap produk bahan bangunan
        </p>
      </header>

      <div className="flex gap-4 mb-6 flex-wrap sm:flex-col sm:gap-3 sm:mb-4">
        <SearchBar onSearch={handleSearch} />
        <FilterSelector
          categories={['triplek', 'kayu', 'besi', 'paralon']}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
};

export default ProductPage;