import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PopUp from '../components/popup/PopUp';

const BASE_URL = 'https://tbnoto19-admin.rplrus.com/api';

const ProfilePage = () => {
	const { isLoggedIn, logout, user, updateProfile, token, setUser } =
		useAuth();
	const navigate = useNavigate();

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
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
	});

	const fields = [
		{ label: 'Nama', name: 'name' },
		{ label: 'Email', name: 'email' },
		{ label: 'Nomor Telepon', name: 'phone', isPhoneWithPrefix: true },
		{ label: 'Alamat', name: 'address' },
	];

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				phone: user.phone?.replace(/^(\+62|62|0)/, '') || '',
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
			};

			await updateProfile(profileData);
			setIsEditing(false);
			setPopupData({
				title: 'Berhasil!',
				message: 'Data profil berhasil diperbarui.',
				icon: 'check',
				actionLabel: 'Tutup',
				actionHref: '/profil',
				redirectTo: '/',
			});
			setPopupOpen(true);
		} catch (error) {
			console.error('Gagal update profil:', error);
			setPopupData({
				title: 'Gagal!',
				message: 'Gagal memperbarui data profil. Silakan coba lagi.',
				icon: 'cross',
				actionLabel: 'Tutup',
				actionHref: '/profil',
				redirectTo: '/',
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
				address: user.address || '',
			});
		}
		setIsEditing(false);
	};

	return (
		<div className="flex justify-center items-center flex-col mt-28 mb-8">
			<h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
				Profil
			</h1>

			<div className="w-full max-w-4xl bg-white rounded-2xl p-10 mx-auto">
				<div className="grid gap-x-8 gap-y-8 ml-0 md:ml-28">
					{fields.map((field, idx) => {
						const isPhone = field.name === 'phone';
						const spanFullRow =
							field.name === 'name' || field.name == 'address';

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
											type={
												field.name === 'email'
													? 'email'
													: 'text'
											}
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
												isPhone ? 'pl-14' : ''
											}`}
											placeholder={
												isPhone ? '81234567890' : ''
											}
										/>
									</div>
								) : (
									<p className="mt-1 text-lg">
										{isPhone
											? `+62 ${formData.phone}`
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
				redirectTo={popupData.redirectTo}
				actionLabel={popupData.actionLabel}
				actionHref={popupData.actionHref}
				showClose={false}
			/>
		</div>
	);
};

export default ProfilePage;
