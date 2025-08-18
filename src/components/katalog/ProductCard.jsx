// ProductCard.jsx - Perbarui untuk menggunakan kategori dari API
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, categories }) => {
	// Fungsi untuk mendapatkan nama kategori dari API
	const getKategoriName = (kategoriId) => {
		const category = categories.find(
			(cat) => cat.id.toString() === kategoriId
		);
		return category ? category.nama_kategori : 'Kategori Tidak Diketahui';
	};

	// Cek apakah stok habis
	const isOutOfStock = product.stok === 0;

	return (
		<div className={`relative ${isOutOfStock ? 'order-last' : ''}`}>
			<Link
				to={`/product/${product.id}`}
				className={`bg-white p-3 rounded-xl border shadow-md text-left cursor-pointer hover:scale-105 transition-all duration-500 block relative ${
					isOutOfStock
						? 'opacity-60 pointer-events-none cursor-not-allowed'
						: ''
				}`}
			>
				<div className="relative">
					<img
						src={product.gambar}
						alt={product.nama}
						className={`w-full h-32 object-cover rounded-lg mb-2 ${
							isOutOfStock ? 'brightness-75' : ''
						}`}
					/>
					{/* Overlay stok habis */}
					{isOutOfStock && (
						<div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
							<span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-lg">
								STOK HABIS
							</span>
						</div>
					)}
				</div>

				<div className="flex flex-col justify-between min-h-[100px]">
					<div className="mb-1">
						<h3
							className={`font-semibold text-lg ${isOutOfStock ? 'text-gray-600' : ''}`}
						>
							{product.nama}
						</h3>
						<p
							className={`text-sm ${isOutOfStock ? 'text-gray-600' : ''}`}
						>
							{product.ukuran}
						</p>
					</div>
					<p
						className={`text-md ${isOutOfStock ? 'text-gray-600' : ''}`}
					>
						Rp{product.harga.toLocaleString()} /{product.satuan_harga}
					</p>
				</div>
			</Link>
		</div>
	);
};

export default ProductCard;
