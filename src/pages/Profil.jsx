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
			setImagePreview(user.profile_photo || null);
		}
	}, [user]);

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const formDataUpload = new FormData();
			formDataUpload.append('profile_photo', file);

			try {
				const res = await fetch(`${BASE_URL}/profile/photo`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
					},
					body: formDataUpload,
				});

				const data = await res.json();
				if (
					res.ok &&
					(data.profile_photo_url || data.data?.profile_photo)
				) {
					const photoUrl =
						data.profile_photo_url || data.data?.profile_photo;
					setImagePreview(photoUrl);
					setUser((prev) => ({ ...prev, profile_photo: photoUrl }));
					alert('Foto profil berhasil diupdate!');
				} else {
					alert('Gagal upload foto profil.');
				}
			} catch (error) {
				alert('Terjadi kesalahan saat upload foto.');
				console.error(error);
			}
		}
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
			setImagePreview(user.profile_photo || null);
		}
		setIsEditing(false);
	};

	return (
		<div className="min-h-screen flex flex-col items-center py-32 px-4">
			<div className="w-full max-w-6xl bg-white rounded-2xl p-8 flex flex-col lg:flex-row gap-10">
				{/* Foto profil */}
				<div className="flex flex-col items-center gap-8 w-full lg:w-1/3">
					<h2 className="text-2xl font-semibold black-800 mb-8">
						PROFILE
					</h2>
					<div className="relative">
						<img
							src={imagePreview || profileImage}
							alt="Profile"
							className="w-48 h-48 rounded-full object-cover border border-gray-300"
						/>
						{isEditing && (
							<>
								<div className="absolute bottom-1 right-2">
									<label
										htmlFor="image-upload"
										className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
										title="Edit Foto"
									>
										<GoPencil className="w-5 h-5" />
									</label>
								</div>
								<input
									id="image-upload"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageChange}
								/>
							</>
						)}
					</div>
				</div>

				{/* Formulir profil */}
				<div className="flex-1 space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[
							{ label: 'Nama', name: 'name' },
							{ label: 'Email', name: 'email' },
							{ label: 'Nomor Telepon', name: 'phone' },
							{
								label: 'Kata Sandi',
								name: 'password',
								isPassword: true,
							},
							{ label: 'Alamat', name: 'address' },
						].map((field, idx) => {
							const isFullWidth = [
								'name',
								'address',
								'password',
							].includes(field.name);
							const isPhone = field.name === 'phone';
							const isPassword = field.isPassword;
							const inputType =
								isPassword && showPassword
									? 'text'
									: isPassword
										? 'password'
										: 'text';

							return (
								<div
									key={idx}
									className={
										isFullWidth ? 'md:col-span-2' : ''
									}
								>
									<label className="block text-lg font-semibold black-600 mb-2">
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
												className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
													isPhone ? 'pl-12' : ''
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
													className="absolute top-1/2 right-4 transform -translate-y-1/2 black-500"
												>
													{showPassword ? '🙈' : '👁️'}
												</button>
											)}
										</div>
									) : (
										<p className="mt-1 text-lg black-800">
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

					{/* Tombol aksi */}
					<div className="flex gap-6 pt-6">
						{isEditing ? (
							<>
								<button
									onClick={handleSave}
									className="bg-primary text-white px-8 py-3 rounded-lg font-medium transition text-base"
								>
									Simpan
								</button>
							</>
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
