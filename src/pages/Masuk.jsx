import React, { useState } from 'react';
import { motion } from 'framer-motion';
import bgImage from '../assets/img/background.png';
import { useAuth } from '../contexts/AuthContext';
import PopUp from '../components/popup/PopUp';

const Masuk = () => {
	const { login } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [popupOpen, setPopupOpen] = useState(false);
	const [popupData, setPopupData] = useState({
		title: '',
		message: '',
		icon: 'check',
		actionLabel: null,
		actionHref: null,
		countdown: null,
		redirectTo: null,
	});

	const [formData, setFormData] = useState({
		phone_number: '',
		password: '',
	});

	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === 'phone_number') {
			const cleaned = value.replace(/\D/g, '');

			if (cleaned.startsWith('0') || cleaned.length > 12) {
				return;
			}

			setFormData({ ...formData, [name]: cleaned });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError('');

		try {
			const response = await fetch(
				'https://tbnoto19-admin.rplrus.com/api/auth/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						phone: '+62' + formData.phone_number,
						password: formData.password,
					}),
				}
			);

			const data = await response.json();

			if (response.ok) {
				login(data.token);
				setPopupData({
					title: 'Berhasil!',
					message: 'Selamat datang, selamat berbelanja.',
					icon: 'check',
					actionLabel: 'Tutup',
					actionHref: '/',
					countdown: '5',
					redirectTo: '/',
				});
			} else {
				setPopupData({
					title: 'Gagal!',
					message: 'Mohon cek data yang Anda input.',
					icon: 'cross',
					actionLabel: 'Tutup',
					actionHref: '/masuk',
					countdown: '5',
					redirectTo: '/',
				});
			}

			setPopupOpen(true);

			setTimeout(() => {
				setFormData({
					phone_number: '',
					password: '',
				});
			}, 5000);
		} catch (error) {
			setPopupData({
				title: 'Gagal!',
				message: error.message || 'Terjadi kesalahan saat mengirim.',
				icon: 'cross',
			});
			setPopupOpen(true);
		}
	};

	return (
		<div
			className="min-h-screen bg-cover bg-center px-8"
			style={{ backgroundImage: `url(${bgImage})` }}
		>
			<div className="flex flex-col md:flex-row items-center justify-center md:justify-end min-h-screen max-w-7xl mx-auto px-4">
				<motion.div
					animate={{ opacity: 1, y: 1 }}
					className="p-6 w-full max-w-2xl md:mr-12 md:mt-8 flex flex-col"
				>
					<h2 className="text-xl md:text-3xl font-semibold mb-6">
						Masuk ke Akun
					</h2>
					<div className="max-h-[70vh] scrollbar-hide pr-1">
						<form
							onSubmit={handleSubmit}
							className="grid grid-cols-1 md:grid-cols-2 gap-4"
						>
							<div className="md:col-span-2">
								<label className="block mb-1">
									Nomor Telepon
								</label>
								<div className="relative flex items-center">
									<span className="absolute left-0 pl-4 text-gray-800">
										+62
									</span>
									<input
										type="number"
										name="phone_number"
										placeholder="Contoh: 81234567890"
										className="w-full pl-16 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
										required
										value={formData.phone_number}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="md:col-span-2 relative">
								<label className="block mb-1">Kata Sandi</label>
								<input
									type={showPassword ? 'text' : 'password'}
									name="password"
									value={formData.password}
									onChange={handleChange}
									minLength={8}
									placeholder="Min: 8 karakter, 1 kapital, 1 angka"
									className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
									required
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute top-[38px] right-4 text-xl"
								>
									{showPassword ? '🔒' : '👁️'}
								</button>
							</div>
							{error && (
								<p className="text-red-500 mt-2 md:col-span-2">
									{error}
								</p>
							)}
							<button
								type="submit"
								className="md:col-span-2 mb-4 w-full bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition font-semibold"
							>
								Masuk
							</button>
						</form>
					</div>
					<div>
						<p className="text-center mt-4">
							Belum memiliki akun?{' '}
							<a
								href="/daftar"
								className="text-primary font-medium hover:underline"
							>
								Daftar
							</a>
						</p>
					</div>
				</motion.div>
			</div>
			<PopUp
				isOpen={popupOpen}
				onClose={() => setPopupOpen(false)}
				title={popupData.title}
				message={popupData.message}
				icon={popupData.icon}
				countdown={popupData.countdown}
				redirectTo={popupData.redirectTo}
				actionLabel={popupData.actionLabel}
				actionHref={popupData.actionHref}
				showClose={false}
			/>
		</div>
	);
};

export default Masuk;
