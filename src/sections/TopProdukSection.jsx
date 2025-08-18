import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/index';

const TopProdukSection = () => {
	const getKategoriName = (id) => {
		const kategori = categories.find((item) => item.id === id);
		return kategori ? kategori.nama_kategori : 'Tidak diketahui';
	};

	const [categories] = useState([]);

	const [products, setProducts] = useState([]);

	useEffect(() => {
		api.get('/barang')
			.then((res) => {
				console.log('Data top barang:', res.data);
				const validProducts = res.data.filter((p) => p.id);
				const shuffled = validProducts.sort(() => Math.random() - 0.5);

				setProducts(shuffled.slice(0, 6));
			})
			.catch((err) => {
				console.error('Fetch top barang error:', err);
			});
	}, []);

	return (
		<section id="unggulan">
			<div className="p-6 md:p-12">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl md:text-3xl font-bold">
						Produk Unggulan
					</h2>
				</div>
				{/* list produk */}
				<div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
					{products.map((product) => {
						if (!product.id) return null;
						return (
							<Link
								to={`/product/${product.id}`}
								key={product.id}
								className="bg-white p-3 rounded-xl border shadow-md cursor-pointer hover:scale-105 transition-all duration-500 grid grid-rows-[auto_1fr_auto] h-full"
							>
								<img
									src={`https://tbnoto19-admin.rplrus.com/storage/${product.foto_barang}`}
									alt={product.nama_barang}
									className="w-full h-32 object-cover rounded-lg mb-2"
								/>
								<h3 className="font-semibold text-lg mb-1">
									{product.nama_barang}
								</h3>
								<p className="text-sm text-gray-700 mb-1 ">
									{product.ukuran}
								</p>
								<p className="text-md font-medium mb-1">
									Rp{Number(product.harga).toLocaleString()} /{product.satuan_harga}
								</p>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default TopProdukSection;
