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
					
					// Fetch detail barang untuk setiap transaksi
					const transactionsWithBarang = await Promise.all(
						res.map(async (trx) => {
							if (trx.barang_id && !trx.barang) {
								try {
									// Asumsi ada API getBarangById
									// const barangDetail = await getBarangById(trx.barang_id);
									// return { ...trx, barang: barangDetail };
									
									// Sementara, beri nama default berdasarkan ID
									return { 
										...trx, 
										nama_barang: `Barang ID: ${trx.barang_id}` 
									};
								} catch {
									return trx;
								}
							}
							return trx;
						})
					);
					
					setTransactions(transactionsWithBarang);
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

	// Helper function untuk mendapatkan informasi produk
	const getProductInfo = (transaction) => {
		// Jika ada data barang lengkap
		if (transaction.barang && transaction.barang.nama_barang) {
			const qty = transaction.quantity || 1;
			const unit = transaction.barang.ukuran || 'unit';
			return `${transaction.barang.nama_barang} (${qty} ${unit})`;
		}
		
		// Jika hanya ada barang_id, tampilkan dengan format yang lebih baik
		if (transaction.barang_id) {
			// Coba ambil dari nama_barang jika ada
			if (transaction.nama_barang) {
				return transaction.nama_barang;
			}
			// Atau format barang_id menjadi lebih readable
			return `Produk ID: ${transaction.barang_id}`;
		}
		
		return 'Produk tidak diketahui';
	};

	// Helper function untuk status dengan warna yang sesuai
	const getStatusDisplay = (status) => {
		// Ubah status dari pending ke pilihan yang lebih sesuai
		let displayStatus = status;
		let statusClass = 'bg-gray-100 text-gray-700';

		switch (status?.toLowerCase()) {
			case 'pending':
			case 'dalam proses':
			case 'diproses':
				displayStatus = 'Dalam Proses';
				statusClass = 'bg-yellow-100 text-yellow-700';
				break;
			case 'selesai':
			case 'completed':
			case 'sukses':
				displayStatus = 'Selesai';
				statusClass = 'bg-green-100 text-green-700';
				break;
			case 'dibatalkan':
			case 'cancelled':
				displayStatus = 'Dibatalkan';
				statusClass = 'bg-red-100 text-red-700';
				break;
			case 'dikirim':
			case 'shipped':
				displayStatus = 'Dikirim';
				statusClass = 'bg-blue-100 text-blue-700';
				break;
			default:
				displayStatus = status || 'Dalam Proses';
				statusClass = 'bg-yellow-100 text-yellow-700';
		}

		return { displayStatus, statusClass };
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
								{transactions.map((trx, index) => {
									const { displayStatus, statusClass } = getStatusDisplay(trx.status_transactions);
									return (
										<tr
											key={trx.id}
											className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
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
											<td className="px-6 py-4 text-left max-w-xs">
												<div className="truncate" title={getProductInfo(trx)}>
													{getProductInfo(trx)}
												</div>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}
												>
													{displayStatus}
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
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Mobile Card View */}
					<div className="md:hidden space-y-4">
						{transactions.map((trx, index) => {
							const { displayStatus, statusClass } = getStatusDisplay(trx.status_transactions);
							return (
								<div
									key={trx.id}
									className="bg-white rounded-xl shadow-md border p-4"
								>
									<div className="flex justify-between items-start mb-3">
										<span
											className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}
										>
											{displayStatus}
										</span>
									</div>

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
												{trx.nama_penerima || '-'}
											</span>
										</div>

										<div className="flex justify-between items-start">
											<span className="text-gray-600 font-medium">
												Produk
											</span>
											<span className="text-gray-900 text-right max-w-48">
												{getProductInfo(trx)}
											</span>
										</div>

										<div className="flex justify-between">
											<span className="text-gray-600 font-medium">
												Total
											</span>
											<span className="text-gray-900 font-medium">
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
							);
						})}
					</div>
				</>
			)}

			{/* Modal Detail */}
			{selectedTransaction && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white w-full max-w-md rounded-lg shadow-lg relative max-h-96 overflow-y-auto">
						<button
							onClick={() => setSelectedTransaction(null)}
							className="absolute top-2 right-3 mb-8 text-gray-500 hover:text-red-500 text-4xl z-10"
						>
							×
						</button>
						<div className="p-6">
							<h3 className="text-xl font-bold mb-4">
								Detail Transaksi
							</h3>
							<div className="space-y-3 text-sm">
								<div className="border-b pb-2">
									<p className="font-semibold text-gray-700 mb-1">Informasi Transaksi</p>
									<p>
										<span className="font-semibold">Tanggal:</span>{' '}
										{formatDate(selectedTransaction.created_at)}
									</p>
									<p>
										<span className="font-semibold">Status:</span>{' '}
										<span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusDisplay(selectedTransaction.status_transactions).statusClass}`}>
											{getStatusDisplay(selectedTransaction.status_transactions).displayStatus}
										</span>
									</p>
								</div>
								
								<div className="border-b pb-2">
									<p className="font-semibold text-gray-700 mb-1">Informasi Penerima</p>
									<p>
										<span className="font-semibold">Nama:</span>{' '}
										{selectedTransaction.nama_penerima || '-'}
									</p>
									<p>
										<span className="font-semibold">Alamat:</span>{' '}
										{selectedTransaction.alamat_pengiriman || '-'}
									</p>
									<p>
										<span className="font-semibold">Telepon:</span>{' '}
										{selectedTransaction.no_telepon || '-'}
									</p>
								</div>

								<div className="border-b pb-2">
									<p className="font-semibold text-gray-700 mb-1">Informasi Produk</p>
									<p>
										<span className="font-semibold">Produk:</span>{' '}
										{getProductInfo(selectedTransaction)}
									</p>
									{selectedTransaction.barang && (
										<>
											<p>
												<span className="font-semibold">Harga Satuan:</span>{' '}
												{formatPrice(selectedTransaction.barang.harga)}
											</p>
											<p>
												<span className="font-semibold">Jumlah:</span>{' '}
												{selectedTransaction.quantity || 1} {selectedTransaction.barang.ukuran || 'unit'}
											</p>
										</>
									)}
								</div>

								<div>
									<p className="font-semibold text-gray-700 mb-1">Pembayaran</p>
									<p>
										<span className="font-semibold">Metode:</span>{' '}
										{selectedTransaction.metode_pembayaran || '-'}
									</p>
									<p>
										<span className="font-semibold">Total Harga:</span>{' '}
										<span className="text-green-600 font-bold">
											{formatPrice(selectedTransaction.total_harga)}
										</span>
									</p>
									<p>
										<span className="font-semibold">Bukti Transfer:</span>{' '}
										{selectedTransaction.bukti_transfer ? (
											<a
												href={selectedTransaction.bukti_transfer}
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
				</div>
			)}
		</div>
	);
};

export default RiwayatPage;