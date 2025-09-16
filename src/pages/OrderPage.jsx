import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkoutCart } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import PopUp from '../components/popup/PopUp';

const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

export default function OrderPage() {
	const { state } = useLocation();
	const { token, user } = useAuth(); // Ambil user dari AuthContext

	const [popup, setPopup] = useState({
		isOpen: false,
		title: '',
		message: '',
	});

	const showPopup = (title, message) => {
		setPopup({ isOpen: true, title, message });
	};

	// Ambil draft order dari navigate state atau localStorage
	const [order, setOrder] = useState(state?.order ?? null);

	// Form fields - akan diisi otomatis dari data user (read-only)
	const [nama, setNama] = useState('');
	const [telp, setTelp] = useState('');
	const [alamat, setAlamat] = useState('');
	const [deskripsi, setDeskripsi] = useState(''); // Field baru untuk deskripsi
	const [metode, setMetode] = useState(''); // e.g. "cod" | "transfer_bri" | "transfer_bca"
	const [buktiTransfer, setBuktiTransfer] = useState(null); // File bukti transfer
	const [previewImage, setPreviewImage] = useState(null); // Preview gambar

	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	// Auto-fill form berdasarkan data user (read-only)
	useEffect(() => {
		if (user) {
			// Auto-fill nama dari field 'name'
			if (user.name) {
				setNama(user.name);
			}

			// Auto-fill nomor telepon dari field 'phone'
			if (user.phone) {
				setTelp(user.phone);
			}

			// Auto-fill alamat dari field 'address'
			if (user.address) {
				setAlamat(user.address);
			}
		}
	}, [user]);

	// Fallback saat refresh halaman
	useEffect(() => {
		if (!order) {
			const cached = localStorage.getItem('pendingOrder');
			if (cached) setOrder(JSON.parse(cached));
		}
	}, [order]);

	// Hitung total untuk validasi COD
	const items = order?.items || [];
	const subtotal =
		order?.total_harga != null
			? Number(order.total_harga)
			: items.reduce(
					(s, it) =>
						s +
						Number(it.price || 0) *
							Number(it.qty ?? it.quantity ?? 1),
					0
				);

	const shipping =
		order?.ongkir != null
			? Number(order.ongkir)
			: Math.round(subtotal * 0.03);

	const total =
		order?.total != null ? Number(order.total) : subtotal + shipping;

	// Reset metode pembayaran COD jika total kurang dari 600rb
	useEffect(() => {
		// Jika user sudah pilih COD tapi total kurang dari 600rb, reset ke kosong
		if (metode === 'cod' && total < 600000) {
			setMetode('');
			// Tampilkan notifikasi
			showPopup(
				'Metode Pembayaran Diubah',
				'COD tidak tersedia untuk pesanan di bawah Rp 600.000. Silakan pilih metode transfer bank.'
			);
		}
	}, [total, metode]);

	// Handle file upload dengan validasi yang lebih baik
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validasi tipe file
			const allowedTypes = [
				'image/jpeg',
				'image/jpg',
				'image/png',
				'image/webp',
			];
			if (!allowedTypes.includes(file.type)) {
				alert('File harus berupa gambar (JPG, PNG, WEBP)');
				return;
			}

			// Validasi ukuran file (maksimal 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert('Ukuran file maksimal 5MB');
				return;
			}

			setBuktiTransfer(file);

			// Buat preview
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewImage(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Reset file when payment method changes
	useEffect(() => {
		if (metode !== 'transfer_bri' && metode !== 'transfer_bca') {
			setBuktiTransfer(null);
			setPreviewImage(null);
		}
	}, [metode]);

	// Copy to clipboard function
	const copyToClipboard = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				// Show temporary feedback
				const event = new CustomEvent('show-toast', {
					detail: {
						message: 'Nomor rekening disalin!',
						type: 'success',
					},
				});
				window.dispatchEvent(event);
			})
			.catch(() => {
				// Fallback for older browsers
				const textArea = document.createElement('textarea');
				textArea.value = text;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				alert('Nomor rekening disalin: ' + text);
			});
	};

	// Jika tetap tidak ada order
	if (!order) {
		return (
			<div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
				<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
					<div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-lg shadow-sm my-4">
						<div className="text-4xl text-gray-400 mb-3">📋</div>
						<p className="text-sm font-medium text-gray-500 mb-4">
							Pesanan tidak ditemukan. Silakan kembali ke
							keranjang.
						</p>
						<button
							onClick={() => navigate('/keranjang')}
							className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors"
						>
							Kembali ke Keranjang
						</button>
					</div>
				</div>
			</div>
		);
	}

	// ✅ FIXED: Kirim checkout ke backend dengan field yang benar
	const handlePlaceOrder = async () => {
		// Validasi form
		if (!nama.trim() || !telp.trim() || !alamat.trim() || !metode) {
			showPopup(
				'Lengkapi Data',
				'Lengkapi Nama Penerima, Nomor Telepon, Alamat, dan Metode Pembayaran.'
			);
			return;
		}

		if (telp.trim().length < 10) {
			showPopup(
				'Nomor Telepon Tidak Valid',
				'Nomor telepon minimal 10 digit.'
			);
			return;
		}

		if (
			(metode === 'transfer_bri' || metode === 'transfer_bca') &&
			!buktiTransfer
		) {
			showPopup(
				'Upload Bukti Transfer',
				'Silakan upload bukti transfer untuk metode pembayaran transfer bank.'
			);
			return;
		}

		// ✅ PERBAIKAN: Pastikan hanya checkout item yang ada di order.items
		// (sudah difilter dari CartPage berdasarkan selectedItems)
		if (!items || items.length === 0) {
			alert('Tidak ada item untuk checkout.');
			return;
		}

		// Siapkan items untuk API - gunakan data dari order yang sudah difilter
		const itemsForApi = items.map((it) => ({
			id: it.cartId,
			cartId: it.cartId,
			productId: it.productId,
			quantity: it.qty ?? it.quantity ?? 1,
			price: Number(it.price || 0),
		}));

		setLoading(true);
		try {
			// Kirim ke checkoutCart dengan data yang sudah difilter, termasuk deskripsi
			const res = await checkoutCart(itemsForApi, token, {
				nama_penerima: nama.trim(),
				no_telepon: telp.trim(),
				alamat_pengiriman: alamat.trim(),
				deskripsi: deskripsi.trim(), // Tambahkan deskripsi
				metode_pembayaran: metode,
				total_harga: subtotal,
				ongkir: shipping,
				bukti_transaksi: buktiTransfer,
			});

			// Hapus draft order dari localStorage
			localStorage.removeItem('pendingOrder');

			// Simpan hasil terakhir (opsional)
			localStorage.setItem('lastOrder', JSON.stringify(res));

			setShowSuccessModal(true);
		} catch (e) {
			console.error('Checkout error:', e);

			// Improved error handling
			let errorMessage = 'Gagal menyelesaikan pesanan.';

			if (
				e.message.includes('401') ||
				e.message.includes('unauthorized')
			) {
				errorMessage =
					'Sesi Anda telah berakhir. Silakan login kembali.';
				setTimeout(() => navigate('/login'), 2000);
			} else if (
				e.message.includes('422') ||
				e.message.includes('validation')
			) {
				errorMessage =
					'Data yang dimasukkan tidak valid. Periksa kembali formulir Anda.';
			} else if (
				e.message.includes('413') ||
				e.message.includes('file too large')
			) {
				errorMessage =
					'File bukti transfer terlalu besar. Maksimal 5MB.';
			} else if (e.message) {
				errorMessage = e.message;
			}

			alert(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
				{/* Header */}
				<header className="mb-3 sm:mb-4">
					<h1 className="text-xl font-bold text-gray-800 mb-0 md:text-2xl lg:text-3xl">
						Checkout Pesanan
					</h1>
					<p className="text-xs text-gray-600 mt-0.5 sm:text-sm">
						Lengkapi data pengiriman untuk menyelesaikan pesanan
						Anda
					</p>
				</header>

				{/* Grid utama: kiri (form), kanan (ringkasan) */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
					{/* === KIRI: Alamat Pengiriman === */}
					<section className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6">
						<h2 className="text-lg font-semibold mb-4 text-gray-900">
							Alamat Pengiriman
						</h2>

						{/* Tampilkan info jika data diambil dari profil */}
						{user && (nama || telp || alamat) && (
							<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
								<div className="flex items-start">
									<svg
										className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
											clipRule="evenodd"
										/>
									</svg>
									<div>
										<p className="text-sm font-medium text-blue-800">
											Data diambil dari profil Anda
										</p>
										<p className="text-xs text-blue-600 mt-1">
											Data tidak dapat diubah di halaman ini. Untuk mengubah data profil, silakan kunjungi halaman profil Anda.
										</p>
									</div>
								</div>
							</div>
						)}

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nama Lengkap{' '}
									<span className="text-red-500">*</span>
								</label>
								<input
									className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
									placeholder="Nama akan diambil dari profil"
									value={nama}
									readOnly
									disabled
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nomor Telepon{' '}
									<span className="text-red-500">*</span>
								</label>
								<input
									className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
									placeholder="Nomor telepon akan diambil dari profil"
									value={telp}
									readOnly
									disabled
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Alamat Lengkap{' '}
									<span className="text-red-500">*</span>
								</label>
								<textarea
									className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed resize-none"
									placeholder="Alamat akan diambil dari profil"
									rows={4}
									value={alamat}
									readOnly
									disabled
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Deskripsi Pesanan
								</label>
								<textarea
									className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
									placeholder="Tambahkan catatan penting untuk pesanan Anda (contoh: alamat lengkap, link google maps, nama penerima di lapangan, dll)"
									rows={3}
									value={deskripsi}
									onChange={(e) => setDeskripsi(e.target.value)}
								/>
								<p className="text-xs text-gray-500 mt-1">
									Maksimal 255 karakter
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Metode Pembayaran{' '}
									<span className="text-red-500">*</span>
								</label>
								
								{/* Tampilkan peringatan jika total kurang dari 600rb */}
								{total < 600000 && (
									<div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
										<div className="flex items-start">
											<svg
												className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											<div>
												<p className="text-sm font-medium text-yellow-800">
													Informasi Pembayaran
												</p>
												<p className="text-xs text-yellow-700 mt-1">
													Untuk pesanan di bawah Rp 600.000, hanya tersedia metode transfer bank.
													COD (Cash on Delivery) tersedia untuk pesanan minimal Rp 600.000.
												</p>
											</div>
										</div>
									</div>
								)}
								
								<select
									className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
									value={metode}
									onChange={(e) => setMetode(e.target.value)}
								>
									<option value="">
										Pilih metode pembayaran
									</option>
									
									{/* COD hanya muncul jika total >= 600rb */}
									{total >= 600000 && (
										<option value="cod">
											COD (Cash on Delivery) - Min. Rp 600.000
										</option>
									)}
									
									<option value="transfer_bri">
										Transfer Bank BRI
									</option>
									<option value="transfer_bca">
										Transfer Bank BCA
									</option>
								</select>

								{/* Tampilkan nomor rekening jika pilih transfer bank */}
								{(metode === 'transfer_bri' ||
									metode === 'transfer_bca') && (
									<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
										<div className="flex items-start">
											<svg
												className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
													clipRule="evenodd"
												/>
											</svg>
											<div className="flex-1">
												<p className="text-sm font-medium text-blue-800 mb-2">
													Informasi Rekening{' '}
													{metode === 'transfer_bri'
														? 'BRI'
														: 'BCA'}
												</p>

												{metode === 'transfer_bri' && (
													<div className="space-y-2">
														<div className="bg-white p-3 rounded border">
															<div className="text-xs text-gray-600 mb-1">
																Bank BRI
															</div>
															<div className="font-mono text-sm font-semibold text-gray-900 flex items-center">
																1234-5678-9012-3456
																<button
																	onClick={() =>
																		copyToClipboard(
																			'1234567890123456'
																		)
																	}
																	className="ml-2 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
																	title="Copy nomor rekening"
																>
																	Copy
																</button>
															</div>
															<div className="text-xs text-gray-600 mt-1">
																a.n. Pemilik
																TB.NOTO19
															</div>
														</div>
														<p className="text-xs text-blue-600">
															• Transfer sesuai
															total pembayaran
															<br />
															• Simpan bukti
															transfer
															<br />• Pesanan akan
															diproses setelah
															pembayaran
															dikonfirmasi
														</p>
													</div>
												)}

												{metode === 'transfer_bca' && (
													<div className="space-y-2">
														<div className="bg-white p-3 rounded border">
															<div className="text-xs text-gray-600 mb-1">
																Bank BCA
															</div>
															<div className="font-mono text-sm font-semibold text-gray-900 flex items-center">
																9876-5432-1098-7654
																<button
																	onClick={() =>
																		copyToClipboard(
																			'9876543210987654'
																		)
																	}
																	className="ml-2 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
																	title="Copy nomor rekening"
																>
																	Copy
																</button>
															</div>
															<div className="text-xs text-gray-600 mt-1">
																a.n. Pemilik
																TB.NOTO19
															</div>
														</div>
														<p className="text-xs text-blue-600">
															• Transfer sesuai
															total pembayaran
															<br />
															• Simpan bukti
															transfer
															<br />• Pesanan akan
															diproses setelah
															pembayaran
															dikonfirmasi
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								)}

								{/* Field Upload Bukti Transfer */}
								{(metode === 'transfer_bri' ||
									metode === 'transfer_bca') && (
									<div className="mt-4">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Upload Bukti Transfer{' '}
											<span className="text-red-500">
												*
											</span>
										</label>

										<div className="space-y-3">
											{/* File Input */}
											<div className="flex items-center justify-center w-full">
												<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
													<div className="flex flex-col items-center justify-center pt-5 pb-6">
														<svg
															className="w-8 h-8 mb-3 text-gray-400"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="2"
																d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
															></path>
														</svg>
														<p className="mb-2 text-sm text-gray-500">
															<span className="font-semibold">
																Klik untuk
																upload
															</span>{' '}
															atau drag & drop
														</p>
														<p className="text-xs text-gray-500">
															PNG, JPG, JPEG
															(Maksimal 5MB)
														</p>
													</div>
													<input
														type="file"
														className="hidden"
														accept="image/*"
														onChange={
															handleFileChange
														}
													/>
												</label>
											</div>

											{/* Preview Image */}
											{previewImage && (
												<div className="mt-3">
													<p className="text-sm font-medium text-gray-700 mb-2">
														Preview Bukti Transfer:
													</p>
													<div className="relative inline-block">
														<img
															src={previewImage}
															alt="Preview bukti transfer"
															className="max-w-full h-40 object-contain rounded-lg border border-gray-300"
														/>
														<button
															type="button"
															onClick={() => {
																setBuktiTransfer(
																	null
																);
																setPreviewImage(
																	null
																);
															}}
															className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
															title="Hapus file"
														>
															×
														</button>
													</div>
													<p className="text-xs text-gray-500 mt-1">
														File:{' '}
														{buktiTransfer?.name} (
														{(
															buktiTransfer?.size /
															1024
														).toFixed(1)}{' '}
														KB)
													</p>
												</div>
											)}

											{/* Upload Tips */}
											<div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
												<div className="flex items-start">
													<svg
														className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
															clipRule="evenodd"
														/>
													</svg>
													<div>
														<p className="text-sm font-medium text-yellow-800">
															Tips Upload Bukti
															Transfer:
														</p>
														<ul className="text-xs text-yellow-700 mt-1 space-y-1">
															<li>
																• Pastikan
																gambar jelas dan
																tidak blur
															</li>
															<li>
																• Terlihat
																nominal transfer
																yang sesuai
															</li>
															<li>
																• Terlihat
																tanggal dan
																waktu transfer
															</li>
															<li>
																• Format file:
																JPG, PNG, atau
																JPEG
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</section>

					{/* === KANAN: Produk Dipesan === */}
					<aside className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
						<h2 className="text-lg font-semibold mb-4 text-gray-900">
							Ringkasan Pesanan
						</h2>

						<div className="space-y-3 mb-4">
							{items.map((it, idx) => (
								<div
									key={idx}
									className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
								>
									<div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
										{it.image ? (
											<img
												src={it.image}
												alt={
													it.name ||
													it.productName ||
													'Produk'
												}
												className="w-full h-full object-cover"
												onError={(e) => {
													e.target.src =
														'/placeholder-image.jpg';
												}}
											/>
										) : (
											<div className="text-xs text-gray-400">
												IMG
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
											{it.name ||
												it.productName ||
												`Barang #${it.productId ?? ''}`}
										</div>
										<div className="flex items-center justify-between">
											<div className="text-xs text-gray-600">
												{rupiah(it.price)} ×{' '}
												{it.qty ?? it.quantity ?? 1}
											</div>
											<div className="text-sm font-semibold text-gray-900">
												{rupiah(
													(Number(it.price) || 0) *
														Number(
															it.qty ??
																it.quantity ??
																1
														)
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="border-t border-gray-200 pt-4 space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">
									Subtotal Barang:
								</span>
								<span className="font-medium text-gray-900">
									{rupiah(subtotal)}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">
									Ongkos Kirim:
								</span>
								<span className="font-medium text-gray-900">
									{rupiah(shipping)}
								</span>
							</div>
							<div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
								<span className="text-gray-900">
									Total Pembayaran:
								</span>
								<span className="text-green-800">
									{rupiah(total)}
								</span>
							</div>

							{/* Tampilkan informasi COD jika total >= 600rb */}
							{total >= 600000 && (
								<div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
									<div className="flex items-center">
										<svg
											className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										<p className="text-xs text-green-700">
											✓ COD tersedia untuk pesanan ini
										</p>
									</div>
								</div>
							)}

							<button
								className="mt-4 w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md py-3 text-sm font-semibold transition-colors"
								onClick={handlePlaceOrder}
								disabled={loading}
							>
								{loading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										<span>Memproses...</span>
									</div>
								) : (
									'Selesaikan Pesanan'
								)}
							</button>

							{/* Informasi keamanan */}
							<div className="mt-3 text-xs text-gray-500 text-center">
								<div className="flex items-center justify-center space-x-1">
									<svg
										className="w-3 h-3"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
											clipRule="evenodd"
										/>
									</svg>
									<span>Transaksi aman & terenkripsi</span>
								</div>
							</div>
						</div>
					</aside>
				</div>

				{/* Back to cart button */}
				<div className="mt-6 text-center">
					<button
						onClick={() => navigate('/keranjang')}
						className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						<span>Kembali ke Keranjang</span>
					</button>
				</div>
			</div>

			{/* Success Modal */}
			{showSuccessModal && (
				<PopUp
					isOpen={showSuccessModal}
					title="Pesanan Berhasil Dibuat!"
					message="Terima kasih telah berbelanja. Pesanan Anda sedang diproses dan akan segera dikirim."
					icon="check"
					hideClose={true}
				>
					<div className="flex flex-col sm:flex-row gap-3 mt-4">
						<button
							onClick={() => {
								setShowSuccessModal(false);
								navigate('/riwayat');
							}}
							className="flex-1 bg-primary text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
						>
							Lihat Riwayat
						</button>
						<button
							onClick={() => {
								setShowSuccessModal(false);
								navigate('/katalog');
							}}
							className="flex-1 py-2 px-4 rounded-md text-sm font-medium border border-primary transition-colors"
						>
							Lanjut Berbelanja
						</button>
					</div>
				</PopUp>
			)}

			<PopUp
				isOpen={popup.isOpen}
				title={popup.title}
				message={popup.message}
				icon="cross"
				hideClose={true}
			>
				<button
					onClick={() => setPopup({ ...popup, isOpen: false })}
					className="mt-3 w-full bg-white text-primary border border-primary rounded-2xl py-2"
				>
					Tutup
				</button>
			</PopUp>
		</div>
	);
}