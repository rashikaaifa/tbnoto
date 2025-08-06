import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/img/lucu.jpg';
import { GoPencil } from 'react-icons/go';
import { useAuth } from '../contexts/AuthContext';
import PopUp from '../components/popup/PopUp';

const BASE_URL = 'https://tbnoto19-admin.rplrus.com/api';

const ProfilePage = () => {
	const { isLoggedIn, logout, user, updateProfile, token, setUser } =
		useAuth();
	const navigate = useNavigate();
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

	const [isEditing, setIsEditing] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		password: '',
		address: '',
	});

	const fields = [
		{ label: 'Nama', name: 'name' },
		{ label: 'Email', name: 'email' },
		{ label: 'Nomor Telepon', name: 'phone', isPhoneWithPrefix: true },
		{ label: 'Kata Sandi', name: 'password', isPassword: true },
		{ label: 'Alamat', name: 'address' },
	];

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				phone: user.phone?.replace(/^(\+62|62|0)/, '') || '',
				password: '',
				address: user.address || '',
			});
		}
	}, [user]);

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSave = async () => {
		try {
			const profileData = {
				name: formData.name,
				email: formData.email,
				phone: `+62${formData.phone.replace(/^(\+62|62|0)/, '')}`,
				address: formData.address,
				...(formData.password && { password: formData.password }),
			};

			await updateProfile(profileData);
			setIsEditing(false);
			setPopupData({
				title: 'Berhasil',
				message: 'Data profil berhasil diperbarui.',
				icon: 'check',
				countdown: 3,
			});
			setPopupOpen(true);
		} catch (error) {
			console.error('Gagal update profil:', error);
			setPopupData({
				title: 'Gagal',
				message: 'Gagal memperbarui data profil. Silakan coba lagi.',
				icon: 'error',
				countdown: 3,
			});
			setPopupOpen(true);
		}
	};

	const handleCancel = () => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				phone: user.phone?.replace(/^(\+62|62|0)/, '') || '',
				password: '',
				address: user.address || '',
			});
		}
		setIsEditing(false);
	};

	return (
		<div className="flex justify-center items-center flex-col py-28">
			<h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center">
				Profil
			</h1>

			<div className="w-full max-w-4xl bg-white rounded-2xl p-10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8">
					{fields.map((field, idx) => {
						const isPhone = field.name === 'phone';
						const isPassword = field.name === 'password';
						const inputType = isPassword
							? showPassword
								? 'text'
								: 'password'
							: 'text';
						const spanFullRow = field.name === 'name';

						return (
							<div
								key={idx}
								className={spanFullRow ? 'md:col-span-2' : ''}
							>
								<label className="block text-lg font-semibold mb-2">
									{field.label}
								</label>

								{isEditing ? (
									<div className="relative">
										{isPhone && (
											<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-base">
												+62
											</span>
										)}
										<input
											type={inputType}
											name={field.name}
											value={
												isPhone
													? formData.phone.replace(
															/^(\+62|62|0)/,
															''
														)
													: formData[field.name]
											}
											onChange={handleChange}
											className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 ${
												isPhone ? 'pl-10' : ''
											}`}
											placeholder={
												isPhone ? '81234567890' : ''
											}
										/>
										{isPassword && (
											<button
												type="button"
												onClick={() =>
													setShowPassword(
														!showPassword
													)
												}
												className="absolute top-1/2 right-4 transform -translate-y-1/2"
											>
												{showPassword ? '🙈' : '👁️'}
											</button>
										)}
									</div>
								) : (
									<p className="mt-1 text-lg">
										{isPhone
											? `+62 ${formData.phone}`
											: isPassword
												? '********'
												: formData[field.name]}
									</p>
								)}
							</div>
						);
					})}
				</div>

				{/* Tombol Aksi */}
				<div className="flex justify-center gap-6 pt-10">
					{isEditing ? (
						<button
							onClick={handleSave}
							className="bg-primary text-white px-8 py-3 rounded-lg font-medium transition text-base"
						>
							Simpan
						</button>
					) : (
						<>
							<button
								onClick={() => setIsEditing(true)}
								className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition text-base"
							>
								Edit Profile
							</button>
							{isLoggedIn && (
								<button
									onClick={async () => {
										await logout();
										navigate('/');
									}}
									className="bg-red-700 text-white px-8 py-3 rounded-lg transition text-base"
								>
									Keluar
								</button>
							)}
						</>
					)}
				</div>
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
			/>
		</div>
	);
};

export default ProfilePage;
