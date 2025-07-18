import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/katalog/ProductGrid';
import PaginationControl from '../components/katalog/PaginationControl';
import { getProducts, getProductCategories } from '../services/productService';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getProductCategories()
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let results = [...products];
    if (searchTerm) {
      results = results.filter(product =>
        product.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      results = results.filter(product => product.kategori === selectedCategory);
    }
    setFilteredProducts(results);
    setCurrentPage(1); // Reset ke halaman 1 setiap filter berubah
  }, [searchTerm, selectedCategory, products]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = (term) => setSearchTerm(term);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // reset saat ganti kategori
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className={`${isMobile ? 'mb-3' : 'mb-6'}`}>
        <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} md:text-3xl lg:text-4xl`}>
          Semua Produk
        </h1>
        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-gray-600 mt-1`}>
          Katalog lengkap produk bahan bangunan
        </p>
      </header>

      {/* Search & Filter */}
      <div className={`${isMobile ? 'flex flex-row space-x-2' : 'flex items-center space-x-4'} mb-6`}>
        <div className={`${isMobile ? 'flex-1' : 'flex-grow max-w-md'}`}>
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full ${isMobile ? 'py-2 text-sm' : 'py-3'} px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
        </div>

        <div className={`${isMobile ? 'w-2/5' : 'w-64'}`}>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className={`w-full ${isMobile ? 'py-2 text-sm' : 'py-3'} px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white`}
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.nama_kategori}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={currentProducts} categories={categories} />

      {/* Pagination Control */}
      {totalPages > 1 && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
          }}
          onNext={() => {
            if (currentPage < totalPages) {
              setCurrentPage((prev) => prev + 1);
              window.scrollTo(0, 0);
            }
          }}
          onPrev={() => {
            if (currentPage > 1) {
              setCurrentPage((prev) => prev - 1);
              window.scrollTo(0, 0);
            }
          }}
        />
      )}
    </div>
  );
};

export default ProductPage;
