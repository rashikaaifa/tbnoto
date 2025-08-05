import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/index';

const ProdukSection = () => {
	const getKategoriName = (id) => {
		const kategori = categories.find((item) => item.id === id);
		return kategori ? kategori.nama_kategori : 'Tidak diketahui';
	};

	const [categories] = useState([]);

	const [products, setProducts] = useState([]);

	useEffect(() => {
		api.get('/barang')
			.then((res) => {
				console.log('Data barang:', res.data);
				setProducts(res.data);
			})
			.catch((err) => {
				console.error('Fetch barang error:', err);
			});
	}, []);

	return (
		<section id="produk">
			<div className="p-6 md:p-12">
				{/* teks "lihat semua" atas */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl md:text-3xl font-bold">
						Semua Produk
					</h2>
				</div>
				{/* list produk */}
				<div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
					{products.slice(0, 12).map((product) => {
						if (!product.id) return null;
						const kategoriNama = getKategoriName(
							product.kategori_id
						);
						return (
							<Link
								to={`/product/${product.id}`}
								key={product.id}
								className="bg-white p-3 rounded-xl border shadow-md text-left cursor-pointer hover:scale-105 transition-all duration-500 block"
							>
								<img
									src={`https://tbnoto19-admin.rplrus.com/storage/${product.foto_barang}`}
									alt={product.nama_barang}
									className="w-full h-32 object-cover rounded-lg mb-2"
								/>
								<h3 className="font-semibold text-lg">
									{product.nama_barang}
								</h3>
								<p className="text-sm">{product.ukuran}</p>
								<p className="text-md">
									Rp
									{Number(product.harga).toLocaleString()}
								</p>
							</Link>
						);
					})}
				</div>
				{/* teks "lihat semua" */}
				<div className="mt-6 mb-6">
					<a href="/katalog">
						<div className="w-full bg-gray-200 text-center text-black py-3 rounded-xl border cursor-pointer hover:bg-gray-300 transition">
							Lihat Semua ...
						</div>
					</a>
				</div>
			</div>
		</section>
	);
};

export default ProdukSection;
