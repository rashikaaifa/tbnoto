import React, { useEffect, useState } from 'react';
import { getRiwayatUser } from '../services/riwayatService';

const RiwayatPage = () => {
	const [transactions, setTransactions] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [showProofModal, setShowProofModal] = useState(false);

	const token = localStorage.getItem('token');

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await getRiwayatUser(token);
				if (Array.isArray(res)) {
					console.log('DATA API:', res);
					
					// Process transactions untuk menambahkan informasi barang
					const processedTransactions = res.map((trx) => {
						// Pastikan semua field yang diperlukan ada
						const processedTrx = {
							...trx,
							// Ambil nama barang dari field yang tersedia di API
							nama_barang: trx.barang?.nama_barang || 
										(trx.barang && Array.isArray(trx.barang) && trx.barang.length > 0 
											? trx.barang[0].nama_barang 
											: trx.nama_barang || 'Produk tidak diketahui'),
							
							// Pastikan field status konsisten
							status: trx.status || trx.status_transactions || 'pending',
							
							// Pastikan field harga ada
							total_harga: trx.total_harga || 0,
							harga_satuan: trx.harga_satuan || (trx.barang && trx.barang[0]?.harga_satuan) || 0,
							quantity: trx.quantity || (trx.barang && trx.barang[0]?.quantity) || 1,
							subtotal: trx.subtotal || (trx.barang && trx.barang[0]?.subtotal) || 0,
							
							// Format tanggal jika perlu
							tgl_transaksi: trx.tgl_transaksi,
							nama_penerima: trx.nama_penerima || 'Tidak diketahui',
							metode_pembayaran: trx.metode_pembayaran || 'Tidak diketahui',
							bukti_transaksi: trx.bukti_transaksi
						};
						
						return processedTrx;
					});
					
					setTransactions(processedTransactions);
				} else {
					setError('Data tidak sesuai format.');
				}
			} catch (err) {
				console.error('Error fetching data:', err);
				setError('Gagal mengambil data.');
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [token]);

	useEffect(() => {
		if (selectedTransaction || showProofModal) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [selectedTransaction, showProofModal]);

	// Helper function untuk format tanggal - DIPERBAIKI
const formatTanggal = (tgl) => {
  const date = new Date(tgl);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

	// Helper function untuk format harga
	const formatPrice = (price) => {
		if (!price || price === 0) return 'Rp 0';
		return `Rp ${Number(price).toLocaleString('id-ID')}`;
	};

const getProductInfo = (transaction) => {
	// Jika ada field barang yang berisi array
	if (Array.isArray(transaction.barang) && transaction.barang.length > 0) {
		return transaction.barang
			.map(item => item.nama_barang || 'Produk tidak diketahui')
			.join(', ');
	}

	// Jika barang adalah object
	if (transaction.barang && typeof transaction.barang === 'object' && !Array.isArray(transaction.barang)) {
		return transaction.barang.nama_barang || 'Produk tidak diketahui';
	}

	// Fallback ke nama_barang langsung
	if (transaction.nama_barang) {
		return transaction.nama_barang;
	}

	return 'Produk tidak diketahui';
};

const getHargaSatuan = (transaction) => {
	if (Array.isArray(transaction.barang) && transaction.barang.length > 0) {
		return transaction.barang
			.map(item => item.harga_satuan ? `Rp${item.harga_satuan.toLocaleString()}` : 'Rp0')
			.join(', ');
	}
	if (transaction.harga_satuan) {
		return `Rp${transaction.harga_satuan.toLocaleString()}`;
	}
	return 'Rp0';
};

const getQuantity = (transaction) => {
	if (Array.isArray(transaction.barang) && transaction.barang.length > 0) {
		return transaction.barang
			.map(item => item.quantity || 0)
			.join(', ');
	}
	return transaction.quantity || 0;
};


	// Helper function untuk status dengan warna yang sesuai - DIPERBAIKI
	const getStatusDisplay = (status) => {
		if (!status || (typeof status !== 'string' && typeof status !== 'number')) {
			return {
				displayStatus: 'Pending',
				statusClass: 'bg-yellow-100 text-yellow-700'
			};
		}

		const statusStr = String(status).toLowerCase();
		
		let displayStatus = status;
		let statusClass = 'bg-gray-100 text-gray-700';

		switch (statusStr) {
			case 'pending':
				displayStatus = 'Pending';
				statusClass = 'bg-yellow-100 text-yellow-700';
				break;
			case 'kode':
				displayStatus = 'Menunggu Kode';
				statusClass = 'bg-blue-100 text-blue-700';
				break;
			case 'label':
				displayStatus = 'Menunggu Pembayaran';
				statusClass = 'bg-orange-100 text-orange-700';
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
				displayStatus = String(status) || 'Pending';
				statusClass = 'bg-yellow-100 text-yellow-700';
		}

		return { displayStatus, statusClass };
	};

	// Function untuk menampilkan modal bukti transaksi
	const handleViewProof = (transaction) => {
		setSelectedTransaction(transaction);
		setShowProofModal(true);
	};

	// Function untuk download bukti transaksi
	const handleDownloadProof = (buktiUrl) => {
		if (buktiUrl && buktiUrl !== 'null') {
			window.open(buktiUrl, '_blank');
		}
	};

	// Component untuk modal bukti transaksi - DIPERBAIKI
	const ProofModal = () => {
		if (!showProofModal || !selectedTransaction) return null;

		return (
			<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
				<div className="bg-white w-full max-w-2xl rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
					<button
						onClick={() => {
							setShowProofModal(false);
							setSelectedTransaction(null);
						}}
						className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-4xl z-10"
					>
						×
					</button>
					<div className="p-6">
						<h3 className="text-xl font-bold mb-6">
							Bukti Transaksi
						</h3>
						
						{/* Informasi Transaksi - DIPERBAIKI */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							<div className="space-y-3">
								<div>
									<label className="text-sm font-medium text-gray-500">Tanggal Transaksi</label>
									<p className="text-lg">{formatTanggal(selectedTransaction.tgl_transaksi)}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Nama Penerima</label>
									<p className="text-lg">{selectedTransaction.nama_penerima || '-'}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Metode Pembayaran</label>
									<p className="text-lg">{selectedTransaction.metode_pembayaran || '-'}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Nama Barang</label>
									<p className="text-lg">{getProductInfo(selectedTransaction)}</p>
								</div>
							</div>
							<div className="space-y-3">
								<div>
									<label className="text-sm font-medium text-gray-500">Status</label>
									<div>
										<span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusDisplay(selectedTransaction.status).statusClass}`}>
											{getStatusDisplay(selectedTransaction.status).displayStatus}
										</span>
									</div>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Total Harga</label>
									<p className="text-lg font-semibold text-green-600">
										{formatPrice(selectedTransaction.total_harga)}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Quantity</label>
									<p className="text-lg">{selectedTransaction.quantity || 1}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Harga Satuan</label>
									<p className="text-lg">{formatPrice(selectedTransaction.harga_satuan)}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Subtotal</label>
									<p className="text-lg font-semibold">{formatPrice(selectedTransaction.subtotal)}</p>
								</div>
							</div>
						</div>

						{/* Bukti Transfer */}
						<div className="border-t pt-6">
							<h4 className="text-lg font-semibold mb-4">Bukti Pembayaran</h4>
							{selectedTransaction.bukti_transaksi && selectedTransaction.bukti_transaksi !== 'null' ? (
								<div className="space-y-4">
									<div className="bg-gray-50 p-4 rounded-lg">
										<img
											src={selectedTransaction.bukti_transaksi}
											alt="Bukti Transaksi"
											className="max-w-full h-auto rounded-lg shadow-md mx-auto"
											onError={(e) => {
												e.target.style.display = 'none';
												e.target.nextSibling.style.display = 'block';
											}}
										/>
										<div className="hidden text-center py-8 text-gray-500">
											<div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
												<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
												</svg>
											</div>
											<p>Gambar tidak dapat dimuat</p>
										</div>
									</div>
									<div className="flex gap-2 justify-center">
										<button
											onClick={() => handleDownloadProof(selectedTransaction.bukti_transaksi)}
											className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
											</svg>
											Download Bukti
										</button>
									</div>
								</div>
							) : (
								<div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
									<div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
										</svg>
									</div>
									<p>Bukti transfer tidak tersedia</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
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
		<>
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
						{/* Desktop Table View - DIPERBAIKI */}
						<div className="hidden md:block overflow-x-auto rounded-lg ml-12 mr-12">
							<table className="min-w-full text-left bg-white">
								<thead className="bg-primary text-white text-center text-md [&>tr>th]:border-white [&>tr>th]:border-r [&>tr>th:last-child]:border-r-0">
									<tr>
										<th className="px-6 py-3">Tanggal</th>
										<th className="px-6 py-3">Penerima</th>
										<th className="px-6 py-3">Barang</th>
										<th className="px-6 py-3">Metode</th>
										<th className="px-6 py-3">Status</th>
										<th className="px-6 py-3">Total Harga</th>
										<th className="px-6 py-3">Aksi</th>
									</tr>
								</thead>
								<tbody className="text-center text-md [&>tr>td]:border-gray-400 [&>tr>td]:border-b [&>tr>td]:border-r [&>tr>td:last-child]:border-r-0">
									{transactions.map((trx, index) => {
										const { displayStatus, statusClass } = getStatusDisplay(trx.status);
										return (
											<tr
												key={trx.id}
												className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
											>
												<td className="px-6 py-4">
													{formatTanggal(trx.tgl_transaksi)}
												</td>
												<td className="px-6 py-4">
													{trx.nama_penerima || '-'}
												</td>
												<td className="px-6 py-4 max-w-xs truncate" title={getProductInfo(trx)}>
													{getProductInfo(trx)}
												</td>
												<td className="px-6 py-4">
													{trx.metode_pembayaran || '-'}
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
													<div className="flex gap-2 justify-center">
														{/* <button
															onClick={() => setSelectedTransaction(trx)}
															className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
														>
															Detail
														</button> */}
														<button
															onClick={() => handleViewProof(trx)}
															className="text-sm text-white bg-blue-600 px-3 py-1 rounded-md"
														>
															Detail
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{/* Mobile Card View - DIPERBAIKI */}
						<div className="md:hidden space-y-4">
							{transactions.map((trx, index) => {
								const { displayStatus, statusClass } = getStatusDisplay(trx.status);
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
													{formatTanggal(trx.tgl_transaksi)}
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

											<div className="flex justify-between">
												<span className="text-gray-600 font-medium">
													Barang
												</span>
												<span className="text-gray-900 text-right max-w-[200px] truncate">
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

										<div className="flex gap-2">
											<button
												onClick={() => setSelectedTransaction(trx)}
												className="flex-1 bg-primary text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
											>
												Detail
											</button>
											{/* <button
												onClick={() => handleViewProof(trx)}
												className="flex-1 bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors hover:bg-green-700"
											>
												Bukti
											</button> */}
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}

				{/* Modal Detail - DIPERBAIKI */}
				{selectedTransaction && !showProofModal && (
					<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
						<div className="bg-white w-full max-w-md rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
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
											{formatTanggal(selectedTransaction.tgl_transaksi)}
										</p>
										<p>
											<span className="font-semibold">Status:</span>{' '}
											<span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusDisplay(selectedTransaction.status).statusClass}`}>
												{getStatusDisplay(selectedTransaction.status).displayStatus}
											</span>
										</p>
									</div>
									
									<div className="border-b pb-2">
										<p className="font-semibold text-gray-700 mb-1">Informasi Penerima</p>
										<p>
											<span className="font-semibold">Nama:</span>{' '}
											{selectedTransaction.nama_penerima || '-'}
										</p>
									</div>

									<div className="border-b pb-2">
										<p className="font-semibold text-gray-700 mb-1">Informasi Produk</p>
										<p>
											<span className="font-semibold">Nama Barang:</span>{' '}
											{getProductInfo(selectedTransaction)}
										</p>
										<div>
									<label className="font-semibold">Quantity: </label>
									{getQuantity(selectedTransaction)}
								</div>
								<div>
									<label className="font-semibold">Harga Satuan: </label>
									
									{getHargaSatuan(selectedTransaction)}
								</div>
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
											<span className="font-semibold">Bukti Transaksi:</span>{' '}
											{selectedTransaction.bukti_transaksi ? (
												<button
													onClick={() => handleViewProof(selectedTransaction)}
													className="text-blue-600 underline hover:text-blue-800"
												>
													Lihat Bukti
												</button>
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

			{/* Modal Bukti Transaksi */}
			<ProofModal />
		</>
	);
};

export default RiwayatPage;