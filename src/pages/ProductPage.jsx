import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Pemetaan kategori_id ke nama kategori yang lebih deskriptif
  const categoryNames = {
    '1': 'Kayu',
    '2': 'Besi',
    '3': 'Paralon',
    '4': 'Triplek',
    '5': 'Semen',
    '8': 'Lainnya',
    // Tambahkan kategori lain sesuai kebutuhan
  };

  // Fungsi untuk menangani perubahan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} md:text-3xl font-bold lg:text-4xl`}>Semua Produk</h1>
        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-gray-600 mt-1`}>Katalog lengkap produk bahan bangunan</p>
      </header>

      {/* Filter dan Search bar - Layout responsif */}
      <div className={`${isMobile ? 'flex flex-row space-x-2' : 'flex items-center space-x-4'} mb-6`}>
        {/* Search Bar Component */}
        <div className={`${isMobile ? 'flex-1' : 'flex-grow max-w-md'}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full ${isMobile ? 'py-2 text-sm' : 'py-3'} px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg 
                className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter Component */}
        <div className={`${isMobile ? 'w-2/5' : 'w-64'}`}>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className={`w-full ${isMobile ? 'py-2 text-sm' : 'py-3'} px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white appearance-none cursor-pointer`}
          >
            <option value="">Semua Kategori</option>
            {Object.entries(categoryNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid Component */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium text-gray-700`}>
            Tidak ada produk yang ditemukan.
          </h3>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500 mt-2`}>
            Coba gunakan filter atau kata kunci pencarian yang berbeda.
          </p>
        </div>
      ) : (
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'}`}>
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <img
                src={product.gambar}
                alt={product.nama}
                className={`w-full ${isMobile ? 'h-24' : 'h-32'} object-cover`}
              />
              <div className={`p-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                <h3 className={`font-medium ${isMobile ? 'text-sm' : 'text-lg'} leading-tight`}>{product.nama}</h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-0.5`}>
                  Kategori: {categoryNames[product.kategori] || product.kategori}
                </p>
                <p className={`${isMobile ? 'text-sm' : 'text-md'} font-medium mt-0.5`}>
                  Rp{Number(product.harga).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;