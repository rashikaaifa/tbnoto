import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import bgImage from '../assets/img/background.png';
import { useAuth } from '../contexts/AuthContext';
import PopUp from '../components/popup/PopUp';

const Daftar = () => {
	const { login } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [popupOpen, setPopupOpen] = useState(false);
	const [popupData, setPopupData] = useState({
		title: '',
		message: '',
		icon: 'check',
		actionLabel: null,
		actionHref: null,
		countdown: 5,
		redirectTo: null,
	});

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone_number: '',
		address: '',
		password: '',
		confirmPassword: '',
	});

	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === 'phone_number') {
			// hanya angka tanpa spasi, +62 fixed di depan
			const cleaned = value.replace(/\D/g, '');

			// no angka 0 di awal
			if (cleaned.startsWith('0')) {
				return;
			}

			if (cleaned.length > 12) {
				return;
			}

			setFormData({ ...formData, [name]: cleaned });
		} else {
			setFormData({ ...formData, [name]: value });
		}

		setError('');

		if (name === 'confirmPassword') {
			if (value !== formData.password) {
				setError('Konfirmasi kata sandi tidak cocok.');
			} else {
				setError('');
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// validasi password
		const passwordPattern = /^(?=.*[A-Z])(?=.*\d).+$/;
		if (!passwordPattern.test(formData.password)) {
			setError(
				'Kata sandi harus mengandung minimal 1 huruf kapital dan 1 angka.'
			);
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			setError('Konfirmasi kata sandi harus sama dengan kata sandi.');
			return;
		}

		if (
			formData.phone_number.length < 9 ||
			formData.phone_number.length > 12
		) {
			setError(
				'Nomor telepon harus 9–12 digit dan tidak boleh diawali 0.'
			);
			return;
		}

		try {
			const response = await fetch(
				'https://tbnoto19-admin.rplrus.com/api/auth/register',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						name: formData.name,
						email: formData.email,
						phone: '+62' + formData.phone_number,
						address: formData.address,
						password: formData.password,
						password_confirmation: formData.confirmPassword,
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
					message: 'Mohon cek koneksi internet.',
					icon: 'cross',
					actionLabel: 'Tutup',
					actionHref: '/',
					countdown: '5',
					redirectTo: '/',
				});
			}

			setPopupOpen(true);

			setTimeout(() => {
				setFormData({
					name: '',
					email: '',
					phone_number: '',
					address: '',
					password: '',
					confirmPassword: '',
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
			<div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-end min-h-screen max-w-7xl mx-auto">
				<motion.div
					animate={{ opacity: 1, y: 1 }}
					className="p-6 w-full max-w-2xl md:mr-12 md:mt-8 flex flex-col"
				>
					<h2 className="text-xl md:text-3xl font-semibold mb-6">
						Buat Akun Baru
					</h2>
					<div className="overflow-y-auto scrollbar-hide pr-1 max-h-[90vh]">
						<form
							onSubmit={handleSubmit}
							className="grid grid-cols-1 md:grid-cols-2 gap-4"
						>
							<div className="md:col-span-2">
								<label className="block mb-1">Nama</label>
								<input
									type="text"
									name="name"
									placeholder="Masukkan nama Anda"
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
									required
									value={formData.name}
									onChange={handleChange}
								/>
							</div>
							<div>
								<label className="block mb-1">Email</label>
								<input
									type="email"
									name="email"
									placeholder="Masukkan alamat email aktif"
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
									required
									value={formData.email}
									onChange={handleChange}
								/>
							</div>
							<div className="block mb-1">
								<label className="block mb-1">
									Nomor Telepon
								</label>
								<div className="relative flex items-center">
									<span className="absolute left-0 pl-4 text-gray-800">
										+62
									</span>
									<input
										type="text"
										name="phone_number"
										placeholder="Contoh: 882003826565"
										className="w-full pl-16 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
										required
										value={formData.phone_number}
										pattern="[1-9][0-9]{8,11}"
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="md:col-span-2">
								<label className="block mb-1">Alamat</label>
								<input
									type="text"
									name="address"
									placeholder="Masukkan alamat rumah Anda"
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
									required
									value={formData.address}
									onChange={handleChange}
								/>
							</div>
							<div className="relative">
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
									{showPassword ? '🙈' : '👁️'}
								</button>
							</div>
							<div className="relative">
								<label className="block mb-1">Kata Sandi</label>
								<input
									type={showPassword ? 'text' : 'password'}
									name="confirmPassword"
									value={formData.confirmPassword}
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
									{showPassword ? '🙈' : '👁️'}
								</button>
							</div>
							{error && (
								<p className="text-red-500 mt-2">{error}</p>
							)}
							<button
								className="md:col-span-2 mb-4 w-full bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition font-semibold"
								type="submit"
							>
								Daftar
							</button>
						</form>
					</div>
					<div>
						<div className="relative text-center">
							<span className="bg-white px-2 z-10 relative">
								atau daftar menggunakan
							</span>
							<div className="absolute left-0 top-1/2 w-full h-[1px] bg-gray-400 -z-0"></div>
						</div>
						<div className="flex justify-center items-center space-x-4 mt-4">
							{[<FcGoogle />].map((icon, index) => (
								<a
									key={index}
									href="https://tbnoto19-admin.rplrus.com/auth/google"
									className="text-2xl"
								>
									{icon}
								</a>
							))}
						</div>
						<p className="text-center mt-4">
							Sudah memiliki akun?{' '}
							<a
								href="/masuk"
								className="text-primary font-medium hover:underline"
							>
								Masuk
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

export default Daftar;
