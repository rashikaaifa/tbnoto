// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
	getProductById,
	addToCart,
	adjustProductStock,
} from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

// Simple Notification Component - inline
const SimpleNotification = ({ show, type, message, onClose }) => {
	useEffect(() => {
		if (show) {
			const t = setTimeout(onClose, 3500);
			return () => clearTimeout(t);
		}
	}, [show, onClose]);
	if (!show) return null;

	const styles =
		type === 'success'
			? 'bg-green-500 text-white'
			: type === 'error'
				? 'bg-red-500 text-white'
				: 'bg-blue-500 text-white';
	const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

	return (
		<div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
			<div
				className={`${styles} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm`}
			>
				<span className="text-xl font-bold">{icon}</span>
				<span className="text-sm font-medium flex-1">{message}</span>
				<button
					onClick={onClose}
					className="text-white/80 hover:text-white transition-colors ml-2 text-lg font-bold"
				>
					×
				</button>
			</div>
		</div>
	);
};

const ProductDetail = () => {
	const { id } = useParams();
	const { isLoggedIn, token } = useAuth();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [inputValue, setInputValue] = useState('1'); // State terpisah untuk input field
	const [isLoading, setIsLoading] = useState(true);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [isBuyingDirect, setIsBuyingDirect] = useState(false);
	const [notification, setNotification] = useState({
		show: false,
		type: 'success',
		message: '',
	});
	const [hasStockError, setHasStockError] = useState(false); // Track jika ada error stok

	const showNotification = (type, message) =>
		setNotification({ show: true, type, message });
	const hideNotification = () =>
		setNotification((prev) => ({ ...prev, show: false }));

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const productId = parseInt(id, 10);
				const data = await getProductById(productId);
				setProduct(data);
			} catch (e) {
				showNotification('error', 'Gagal memuat detail produk');
			} finally {
				setIsLoading(false);
			}
		};
		fetchProduct();
	}, [id]);

	// Validasi dan update quantity
	const validateAndSetQuantity = (value) => {
		if (!product) return;

		const numValue = parseInt(value, 10);

		if (isNaN(numValue) || numValue < 1) {
			setQuantity(1);
			setInputValue('1');
			setHasStockError(false);
			return;
		}

		if (numValue > product.stok) {
			setQuantity(product.stok);
			setInputValue(product.stok.toString());
			setHasStockError(true); // Set flag error
			showNotification('error', `Maksimal ${product.stok} item tersedia`);
			return;
		}

		setQuantity(numValue);
		setInputValue(numValue.toString());
		setHasStockError(false); // Reset flag error jika valid
	};

	const handleIncreaseQuantity = () => {
		if (!product) return;
		if (quantity < product.stok) {
			const newQuantity = quantity + 1;
			setQuantity(newQuantity);
			setInputValue(newQuantity.toString());
			setHasStockError(false);
		} else {
			setHasStockError(true);
			showNotification('error', `Maksimal ${product.stok} item tersedia`);
		}
	};

	const handleDecreaseQuantity = () => {
		if (quantity > 1) {
			const newQuantity = quantity - 1;
			setQuantity(newQuantity);
			setInputValue(newQuantity.toString());
			setHasStockError(false);
		}
	};

	// Handle input change
	const handleInputChange = (e) => {
		const value = e.target.value;
		// Hanya izinkan angka
		if (/^\d*$/.test(value)) {
			setInputValue(value);
			// Reset error flag saat user mulai mengetik
			if (hasStockError) {
				setHasStockError(false);
			}
		}
	};

	// Handle input blur (saat user selesai mengetik)
	const handleInputBlur = () => {
		validateAndSetQuantity(inputValue);
	};

	// Handle Enter key
	const handleInputKeyPress = (e) => {
		if (e.key === 'Enter') {
			validateAndSetQuantity(inputValue);
			e.target.blur(); // Remove focus from input
		}
	};

	const calculateTotalPrice = () => (product ? product.harga * quantity : 0);

	const handleAddToCart = async () => {
		if (!product) return;
		if (!isLoggedIn) {
			showNotification(
				'error',
				'Silakan login terlebih dahulu untuk berbelanja'
			);
			return;
		}
		if (product.stok === 0) {
			showNotification('error', 'Maaf, stok produk habis');
			return;
		}

		// ✅ PERBAIKAN: Cek ulang quantity vs stok sebelum proses addToCart
		if (quantity > product.stok) {
			showNotification(
				'error',
				`Stok hanya tersisa ${product.stok} item`
			);
			setQuantity(product.stok);
			setInputValue(product.stok.toString());
			setHasStockError(true);
			return;
		}

		// ✅ PERBAIKAN: Jika masih ada flag error stok, jangan lanjut
		if (hasStockError) {
			showNotification(
				'error',
				'Silakan perbaiki jumlah item terlebih dahulu'
			);
			return;
		}

		setIsAddingToCart(true);
		try {
			// Tambah ke keranjang saja — stok DB tidak disentuh di frontend
			await addToCart(product.id, quantity, token);

			showNotification(
				'success',
				`${product.nama} berhasil ditambahkan ke keranjang!`
			);
			// Opsional: reset qty ke 1 agar UX enak
			setQuantity(1);
			setInputValue('1');
			setHasStockError(false);
		} catch (e) {
			showNotification(
				'error',
				e.message ||
					'Gagal menambahkan ke keranjang. Silakan coba lagi.'
			);
		} finally {
			setIsAddingToCart(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex justify-center items-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg font-medium">Memuat detail produk...</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-gray-50 flex justify-center items-center">
				<div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
					<div className="text-gray-400 mb-4">
						<svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4-4m0 0L9 5m6 0V1"></path>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Produk tidak ditemukan
					</h2>
					<p className="text-gray-600 mb-6">
						Maaf, produk yang Anda cari tidak dapat ditemukan.
					</p>
					<Link
						to="/katalog"
						className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m6-7l-7 7 7 7"></path>
						</svg>
						Kembali ke Katalog
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Navigation */}
			<div className="bg-white shadow-sm border-b sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<Link
						to="/katalog"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group"
					>
						<svg
							className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 12H5M12 19l-7-7 7-7"
							/>
						</svg>
						Kembali ke Katalog
					</Link>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
					<div className="flex flex-col lg:flex-row">
						{/* Product Image Section */}
						<div className="w-full lg:w-1/2 p-8">
							<div className="aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-inner">
								<img
									src={product.gambar}
									alt={product.nama}
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
								/>
							</div>
						</div>

						{/* Product Info Section */}
						<div className="w-full lg:w-1/2 p-8 flex flex-col">
							{/* Product Header */}
							<div className="mb-8">
								<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
									{product.nama}
								</h1>
								<div className="flex items-center gap-3 mb-4">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
										{product.ukuran}
									</span>
									<div className="flex items-center gap-1">
										<span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
											product.stok > 10 
												? 'bg-green-100 text-green-800' 
												: product.stok > 0 
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-red-100 text-red-800'
										}`}>
											<div className={`w-2 h-2 rounded-full ${
												product.stok > 10 
													? 'bg-green-500' 
													: product.stok > 0 
														? 'bg-yellow-500'
														: 'bg-red-500'
											}`}></div>
											{product.stok > 0 ? `${product.stok} tersedia` : 'Stok habis'}
										</span>
									</div>
								</div>
								<p className="text-gray-700 text-lg leading-relaxed">
									{product.deskripsi}
								</p>
							</div>

							{/* Order Section */}
							<div className="mt-auto">
								<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
									<div className="text-center mb-8">
										<h2 className="text-2xl font-bold text-gray-900 mb-2">
											Buat Pesanan
										</h2>
										<p className="text-gray-600">
											Pilih jumlah yang diinginkan
										</p>
									</div>

									{/* Quantity Selector */}
									<div className="flex items-center justify-center mb-6">
										<button
											onClick={handleDecreaseQuantity}
											disabled={quantity <= 1}
											className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border-2 border-gray-200 text-gray-700 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
										>
											−
										</button>

										<input
											type="text"
											value={inputValue}
											onChange={handleInputChange}
											onBlur={handleInputBlur}
											onKeyPress={handleInputKeyPress}
											className={`mx-4 w-20 h-12 text-center font-bold text-xl border-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-4 transition-all shadow-sm ${
												hasStockError
													? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50 text-red-700'
													: 'border-gray-200 focus:ring-green-500/20 focus:border-green-500 bg-white'
											}`}
											min="1"
											max={product.stok}
										/>

										<button
											onClick={handleIncreaseQuantity}
											disabled={quantity >= product.stok}
											className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border-2 border-gray-200 text-gray-700 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
										>
											+
										</button>
									</div>

									{/* Stock Error Warning */}
									{hasStockError && (
										<div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
											<div className="flex items-center">
												<div className="flex-shrink-0">
													<svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
													</svg>
												</div>
												<div className="ml-3">
													<p className="text-sm font-medium text-red-800">
														Jumlah melebihi stok tersedia. Maksimal {product.stok} item.
													</p>
												</div>
											</div>
										</div>
									)}

									{/* Price Summary */}
									<div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
										<div className="flex justify-between items-center mb-4">
											<span className="text-gray-600 font-medium">Harga satuan:</span>
											<span className="text-lg font-semibold text-gray-900">
												Rp{product.harga.toLocaleString('id-ID')}
											</span>
										</div>
										<div className="flex justify-between items-center mb-4">
											<span className="text-gray-600 font-medium">Jumlah:</span>
											<span className="text-lg font-semibold text-gray-900">
												{quantity} item
											</span>
										</div>
										<div className="border-t border-gray-200 pt-4">
											<div className="flex justify-between items-center">
												<span className="text-lg font-bold text-gray-900">Total harga:</span>
												<span className="text-2xl font-bold text-green-600">
													Rp{calculateTotalPrice().toLocaleString('id-ID')}
												</span>
											</div>
										</div>
									</div>

									{/* Add to Cart Button */}
									<button
										onClick={handleAddToCart}
										disabled={
											isAddingToCart ||
											product.stok === 0 ||
											!isLoggedIn ||
											hasStockError
										}
										className="w-full flex justify-center items-center bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
									>
										{isAddingToCart ? (
											<>
												<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
												Menambahkan ke Keranjang...
											</>
										) : (
											<>
												<svg
													className="w-6 h-6 mr-3"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
													/>
												</svg>
												{!isLoggedIn
													? 'Login untuk Berbelanja'
													: product.stok === 0
														? 'Stok Habis'
														: hasStockError
															? 'Perbaiki Jumlah Item'
															: 'Masukkan ke Keranjang'}
											</>
										)}
									</button>

									{!isLoggedIn && (
										<p className="text-center text-sm text-gray-500 mt-4">
											Silakan login terlebih dahulu untuk melakukan pemesanan
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<SimpleNotification
				show={notification.show}
				type={notification.type}
				message={notification.message}
				onClose={hideNotification}
			/>
		</div>
	);
};

export default ProductDetail;