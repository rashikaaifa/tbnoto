import React, { useEffect, useState } from 'react';
import { getRiwayatUser } from '../services/riwayatService';

const RiwayatPage = () => {
	const [transactions, setTransactions] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	const token = localStorage.getItem('token');

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await getRiwayatUser(token);
				if (Array.isArray(res)) {
					console.log('DATA API:', res);
					setTransactions(res);
				} else {
					setError('Data tidak sesuai format.');
				}
			} catch (err) {
				setError('Gagal mengambil data.');
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [token]);

	useEffect(() => {
		if (selectedTransaction) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		// Bersihkan efek saat komponen unmount
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [selectedTransaction]);

	// Helper function untuk format tanggal
	const formatDate = (dateString) => {
		if (!dateString) return '-';
		try {
			const date = new Date(dateString.replace(' ', 'T'));
			return date.toLocaleDateString('id-ID', {
				day: '2-digit',
				month: 'long',
				year: 'numeric',
			});
		} catch (e) {
			return '-';
		}
	};

	// Helper function untuk format harga
	const formatPrice = (price) => {
		if (!price) return '-';
		return `Rp ${Number(price).toLocaleString('id-ID')}`;
	};

	if (loading)
		return (
			<div className="min-h-screen py-10 px-4 bg-white">
				<div className="flex justify-center items-center h-64">
					<div className="text-lg">Loading...</div>
				</div>
			</div>
		);

	if (error)
		return (
			<div className="min-h-screen py-10 px-4 bg-white">
				<div className="text-red-500 text-center">{error}</div>
			</div>
		);

	return (
		<div className="min-h-screen py-32 px-4">
			<h2 className="text-2xl sm:text-4xl font-bold mb-12 lg:ml-12 w-full sm:w-4/5 text-left">
				Riwayat Transaksi
			</h2>

			{transactions.length === 0 ? (
				<div className="text-center mt-10">
					<p className="text-xl font-semibold text-gray-700 mb-2">
						Belum ada pembelian.
					</p>
					<p className="text-gray-500 mb-4">
						Ayo mulai belanja kebutuhan bangunanmu!
					</p>
					<button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md inline-block">
						Belanja Sekarang
					</button>
				</div>
			) : (
				<>
					{/* Desktop Table View */}
					<div className="hidden md:block overflow-x-auto rounded-lg ml-12 mr-12">
						<table className="min-w-full text-left bg-white">
							<thead className="bg-primary text-white text-center text-md [&>tr>th]:border-white [&>tr>th]:border-r [&>tr>th:last-child]:border-r-0">
								<tr>
									<th className="px-6 py-3">Tanggal</th>
									<th className="px-6 py-3">Penerima</th>
									<th className="px-6 py-3">Metode</th>
									<th className="px-6 py-3">Produk Dibeli</th>
									<th className="px-6 py-3">Status</th>
									<th className="px-6 py-3">Total Harga</th>
									<th className="px-6 py-3">Aksi</th>
								</tr>
							</thead>
							<tbody className="text-center text-md [&>tr>td]:border-gray-400 [&>tr>td]:border-b [&>tr>td]:border-r [&>tr>td:last-child]:border-r-0">
								{transactions.map((trx, index) => (
									<tr
										key={trx.id}
										className={`${index % 2 === 0}`}
									>
										<td className="px-6 py-4">
											{formatDate(trx.created_at)}
										</td>
										<td className="px-6 py-4">
											{trx.nama_penerima || '-'}
										</td>
										<td className="px-6 py-4">
											{trx.metode_pembayaran || '-'}
										</td>
										<td className="px-6 py-4">
											{trx.barang_id || '-'}
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2 py-1 rounded-full text-xs font-semibold ${
													trx.status_transactions ===
													'Dalam Proses'
														? 'bg-yellow-100 text-yellow-700'
														: trx.status_transactions ===
															  'Selesai'
															? 'bg-green-100 text-green-700'
															: 'bg-gray-100 text-gray-700'
												}`}
											>
												{trx.status_transactions || '-'}
											</span>
										</td>
										<td className="px-6 py-4 font-medium text-gray-900">
											{formatPrice(trx.total_harga)}
										</td>
										<td className="px-6 py-4 text-center border-r-0">
											<button
												onClick={() =>
													setSelectedTransaction(trx)
												}
												className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
											>
												Detail
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Mobile Card View */}
					<div className="md:hidden space-y-4">
						{transactions.map((trx, index) => (
							<div
								key={trx.id}
								className="bg-white rounded-xl shadow-md border p-4"
							>
								<div className="flex justify-between items-start mb-3"></div>

								<div className="space-y-2 text-sm mb-4">
									<div className="flex justify-between">
										<span className="text-gray-600 font-medium">
											Tanggal
										</span>
										<span className="text-gray-900">
											{formatDate(trx.created_at)}
										</span>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600 font-medium">
											Penerima
										</span>
										<span className="text-gray-900">
											{(trx.nama_penerima)}
										</span>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600 font-medium">
											Produk
										</span>
										<span className="text-gray-900">
											{formatPrice(trx.total_harga)}
										</span>
									</div>
								</div>

								<button
									onClick={() => setSelectedTransaction(trx)}
									className="w-full bg-primary text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
								>
									Detail
								</button>
							</div>
						))}
					</div>
				</>
			)}

			{/* Modal Detail - sama seperti sebelumnya */}
			{selectedTransaction && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white w-full max-w-md rounded-lg shadow-lg relative">
						<button
							onClick={() => setSelectedTransaction(null)}
							className="absolute top-2 right-3 mb-8 text-gray-500 hover:text-red-500 text-4xl"
						>
							×
						</button>
						<div className="p-6">
							<h3 className="text-xl font-bold mb-4">
								Detail Transaksi
							</h3>
							<div className="space-y-2 text-sm">
								<p>
									<span className="font-semibold">
										Tanggal:
									</span>{' '}
									{formatDate(selectedTransaction.created_at)}
								</p>
								<p>
									<span className="font-semibold">
										Penerima:
									</span>{' '}
									{selectedTransaction.nama_penerima}
								</p>
								<p>
									<span className="font-semibold">
										Alamat:
									</span>{' '}
									{selectedTransaction.alamat_pengiriman}
								</p>
								<p>
									<span className="font-semibold">
										Telepon:
									</span>{' '}
									{selectedTransaction.no_telepon}
								</p>
								<p>
									<span className="font-semibold">
										Metode:
									</span>{' '}
									{selectedTransaction.metode_pembayaran}
								</p>
								<p>
									<span className="font-semibold">
										Barang yang Dibeli:
									</span>{' '}
									{selectedTransaction.barang_id}
								</p>
								<p>
									<span className="font-semibold">
										Status:
									</span>{' '}
									{selectedTransaction.status_transactions}
								</p>
								<p>
									<span className="font-semibold">
										Total Harga:
									</span>{' '}
									{formatPrice(
										selectedTransaction.total_harga
									)}
								</p>
								<p>
									<span className="font-semibold">
										Bukti Transfer:
									</span>{' '}
									{selectedTransaction.bukti_transfer ? (
										<a
											href={
												selectedTransaction.bukti_transfer
											}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 underline"
										>
											Lihat Bukti
										</a>
									) : (
										<span className="text-gray-500">-</span>
									)}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default RiwayatPage;
