import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ProductCard from '../components/keranjang/ProductCard';
import CartSummary from '../components/keranjang/CartSummary';
import MobileSummary from '../components/keranjang/MobileSummary';
import DeleteConfirmation from '../services/DeleteConfirmation';

import { useCartState } from '../services/useCartState';
import { useAuth } from '../contexts/AuthContext';

const Keranjang = () => {
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const {
		products,
		selectedProducts,
		quantities,
		isLoading,
		error,
		toggleProductSelection,
		updateQuantity,
		removeProduct,
		calculateSummary,
		refreshCart,
	} = useCartState();

	const [isMobileSummaryExpanded, setIsMobileSummaryExpanded] =
		useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		isOpen: false,
		productId: null,
		productName: '',
	});
	const [isCheckingOut, setIsCheckingOut] = useState(false);

	const toggleMobileSummary = () =>
		setIsMobileSummaryExpanded(!isMobileSummaryExpanded);

	const handleShowDeleteConfirmation = (productId, productName) => {
		setDeleteConfirmation({ isOpen: true, productId, productName });
	};

	const handleConfirmDelete = async () => {
		if (deleteConfirmation.productId) {
			await removeProduct(deleteConfirmation.productId);
			setDeleteConfirmation({
				isOpen: false,
				productId: null,
				productName: '',
			});
		}
	};

	const handleCancelDelete = () =>
		setDeleteConfirmation({
			isOpen: false,
			productId: null,
			productName: '',
		});

	const handleLoginRedirect = () => navigate('/login');

	const summary = calculateSummary();

	// === Pindahkan proses checkout ke OrderPage ===
	const goToOrderPage = () => {
		if (!isLoggedIn) {
			return navigate('/login', { state: { from: '/keranjang' } });
		}

		const selected = products
			.filter((p) => selectedProducts[p.id])
			.map((p) => ({
				id: p.id, // cart item id
				cartId: p.id,
				productId: p.productId, // product id
				quantity: quantities[p.id] || 1,
				price: p.price || 0,
				name: p.name,
				image: p.image,
				size: p.size,
			}));

		if (selected.length === 0) {
			alert('Pilih minimal 1 barang untuk checkout.');
			return;
		}

		// buat draft order supaya OrderPage langsung tampil
		const subtotal = selected.reduce(
			(s, it) => s + it.price * it.quantity,
			0
		);
		const shipping = Math.round(subtotal * 0.03);
		const total = subtotal + shipping;

		const orderDraft = {
			items: selected.map((it) => ({
				productId: it.productId,
				name: it.name,
				image: it.image,
				size: it.size,
				price: it.price,
				qty: it.quantity,
			})),
			subtotal,
			shipping,
			total,
		};

		localStorage.setItem('pendingOrder', JSON.stringify(orderDraft));
		navigate('/orderpage', { state: { order: orderDraft } });
	};

	if (!isLoggedIn) {
		return (
			<div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
				<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
					<header className="mb-3 sm:mb-4">
						<h1 className="text-xl font-bold text-gray-800 mb-0 md:text-2xl lg:text-3xl">
							Keranjang
						</h1>
						<p className="text-xs text-gray-600 mt-0.5 sm:text-sm">
							Produk berada di keranjang maksimal selama 2 hari
						</p>
					</header>
					<div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-lg shadow-sm my-4">
						<div className="text-4xl text-gray-400 mb-3">🔒</div>
						<p className="text-sm font-medium text-gray-500 mb-4">
							Silakan login untuk melihat keranjang Anda
						</p>
						<button
							onClick={handleLoginRedirect}
							className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors"
						>
							Login Sekarang
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
				<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
					<header className="mb-3 sm:mb-4">
						<h1 className="text-xl font-bold text-gray-800 mb-0 md:text-2xl lg:text-3xl">
							Keranjang
						</h1>
						<p className="text-xs text-gray-600 mt-0.5 sm:text-sm">
							Produk berada di keranjang maksimal selama 2 hari
						</p>
					</header>
					<div className="flex justify-center items-center h-60 text-gray-600 text-lg">
						<div className="flex items-center space-x-2">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-800"></div>
							<span>Memuat keranjang...</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
				<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
					<header className="mb-3 sm:mb-4">
						<h1 className="text-xl font-bold text-gray-800 mb-0 md:text-2xl lg:text-3xl">
							Keranjang
						</h1>
						<p className="text-xs text-gray-600 mt-0.5 sm:text-sm">
							Produk berada di keranjang maksimal selama 2 hari
						</p>
					</header>
					<div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-lg shadow-sm my-4">
						<div className="text-4xl text-red-400 mb-3">⚠️</div>
						<p className="text-sm font-medium text-red-500 mb-2">
							Terjadi kesalahan saat memuat keranjang
						</p>
						<p className="text-xs text-gray-500 mb-4">{error}</p>
						<div className="flex space-x-2">
							<button
								onClick={refreshCart}
								className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors"
							>
								Coba Lagi
							</button>
							<Link
								to="/katalog"
								className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors"
							>
								Kembali Belanja
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
				<header className="mb-3 sm:mb-4">
					<h1 className="text-xl font-bold text-gray-800 mb-0 md:text-2xl lg:text-3xl">
						Keranjang
					</h1>
					<p className="text-xs text-gray-600 mt-0.5 sm:text-sm">
						Produk berada di keranjang maksimal selama 2 hari
					</p>
				</header>

				{deleteConfirmation.isOpen && (
					<DeleteConfirmation
						productName={deleteConfirmation.productName}
						onConfirm={handleConfirmDelete}
						onCancel={handleCancelDelete}
					/>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
					<div className="flex flex-col gap-2 sm:gap-3 lg:col-span-2 mb-20 sm:mb-20">
						{products.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-lg shadow-sm my-4">
								<div className="text-4xl text-gray-400 mb-3">
									🛒
								</div>
								<p className="text-sm font-medium text-gray-500 mb-4">
									Keranjang Anda kosong
								</p>
								<Link
									to="/katalog"
									className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors"
								>
									Belanja Sekarang
								</Link>
							</div>
						) : (
							<>
								{process.env.NODE_ENV === 'development' && (
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
										<p className="text-xs text-blue-700">
											Debug: {products.length} items
											loaded
										</p>
									</div>
								)}

								{products.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										isSelected={
											!!selectedProducts[product.id]
										}
										quantity={quantities[product.id] || 1}
										onToggleSelect={() =>
											toggleProductSelection(product.id)
										}
										onUpdateQuantity={(amount) =>
											updateQuantity(product.id, amount)
										}
										onRemove={handleShowDeleteConfirmation}
									/>
								))}
							</>
						)}
					</div>

					<div className="hidden lg:block">
						<CartSummary
							summary={summary}
							disabled={summary.totalItems === 0}
							onCheckout={goToOrderPage}
							loading={isCheckingOut}
						/>
					</div>
				</div>

				{/* Mobile summary */}
				<div className="block lg:hidden">
					<MobileSummary
						summary={summary}
						isExpanded={isMobileSummaryExpanded}
						onToggle={toggleMobileSummary}
						disabled={summary.totalItems === 0}
						onCheckout={goToOrderPage}
						loading={isCheckingOut}
					/>
				</div>
			</div>
		</div>
	);
};

export default Keranjang;
