import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, categories }) => {
	const sortedProducts = [...products].sort((a, b) => {
		if (a.stok === 0 && b.stok > 0) return 1;
		if (b.stok === 0 && a.stok > 0) return -1;
		return a.nama.localeCompare(b.nama);
	});

	return (
		<div className="w-full">
			{products.length === 0 ? (
				<div className="text-center py-12">
					<h3 className="text-xl font-medium text-gray-700">
						Tidak ada produk yang ditemukan.
					</h3>
					<p className="text-gray-500 mt-2">
						Coba gunakan filter atau kata kunci pencarian yang
						berbeda.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
					{sortedProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							categories={categories}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ProductGrid;
