// // ProductPage.jsx
// import React, { useState, useEffect } from 'react';
// import ProductGrid from '../components/ProductGrid';
// import SearchBar from '../components/SearchBar';
// import FilterSelector from '../components/FilterSelector';
// import { getProducts } from '../services/productService';
// import '../styles/ProductPage.css';

// const ProductPage = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const data = await getProducts();
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     filterProducts();
//   }, [searchTerm, selectedCategory, products]);

//   const filterProducts = () => {
//     let results = [...products];

//     if (searchTerm) {
//       results = results.filter(product => 
//         product.nama.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (selectedCategory) {
//       results = results.filter(product => 
//         product.kategori === selectedCategory
//       );
//     }

//     setFilteredProducts(results);
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//   };

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//   }; 

//   if (isLoading) {
//     return <div className="loading">Memuat produk...</div>;
//   }

//   return (
//     <div className="product-page">
//       <header className="page-header">
//         <h1>Semua Produk</h1>
//         <p className="subtitle">Katalog lengkap produk bahan bangunan</p>
//       </header>

//       <div className="filters-container">
//         <SearchBar onSearch={handleSearch} />
//         <FilterSelector 
//           categories={['triplek', 'kayu', 'besi', 'paralon']}
//           selectedCategory={selectedCategory}
//           onCategorySelect={handleCategorySelect}
//         />
//       </div>

//       <ProductGrid products={filteredProducts} />
//     </div>
//   );
// };

// export default ProductPage;