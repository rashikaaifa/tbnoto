import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/index';

const KategoriSection = () => {
	const [categories, setCategories] = useState([]);

	const getKategoriName = (id) => {
		const kategori = categories.find((item) => item.id === id);
		return kategori ? kategori.nama_kategori : 'Tidak diketahui';
	};

	useEffect(() => {
		api.get('/kategori')
			.then((res) => {
				console.log('Data kategori:', res.data);
				setCategories(res.data);
			})
			.catch((err) => {
				console.error('Fetch kategori error:', err);
			});
	}, []);

	return (
		<section id="kategori">
			<div className="p-6 md:p-12">
				<h2 className="text-3xl font-bold text-center mb-8">
					Kategori
				</h2>
				<div className="grid grid-cols-3 md:grid-cols-6 gap-4">
					{categories.map((kategori) => (
						<Link
							key={kategori.id}
							to={`/katalog/kategori/${kategori.nama_kategori.toLowerCase().replace(/\s+/g, '-')}`}
							className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all duration-500 block"
						>
							<img
								src={`https://tbnoto19-admin.rplrus.com/storage/${kategori.foto_kategori}`}
								alt={kategori.nama_kategori}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
								<span className="text-white font-semibold text-lg">
									{kategori.nama_kategori}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

export default KategoriSection;
