import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PopUp from '../components/popup/PopUp';
import faq from '../assets/img/faqhome.png';
import api from '../api';

const FAQSection = () => {
	// pop up
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

	// faq
	const [formData, setFormData] = useState({
		nama: '',
		email: '',
		pertanyaan: '',
	});

	// fetch
	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log('Form data:', formData);

		try {
			const response = await api.post('/faq', formData);

			// berhasil
			setPopupData({
				title: 'Berhasil!',
				message:
					'Saran/Pertanyaan Anda akan segera kami balas via email. Terima kasih.',
				icon: 'check',
				actionLabel: 'Tutup',
				actionHref: '/',
				countdown: '',
				redirectTo: '/',
			});
			setPopupOpen(true);
			setFormData({ nama: '', email: '', pertanyaan: '' });
		} catch (error) {
			// gagal
			setPopupData({
				title: 'Gagal!',
				message: error.message || 'Terjadi kesalahan saat mengirim.',
				icon: 'cross',
			});
			setPopupOpen(true);
		}
	};

	return (
		<section id="faq">
			<div className="p-6 md:p-12">
				<h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
					Formulir Saran & Pertanyaan
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
					{/* gambar */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7 }}
						viewport={{ once: true }}
						className="relative w-full justify-center hidden md:flex"
					>
						<div className="w-full lg:w-8/12 space-y-4">
							<div className="aspect-w-4 aspect-h-3 overflow-hidden">
								<motion.img
									src={faq}
									alt="Perjalanan Usaha"
									className="w-full h-full"
								/>
							</div>
						</div>
					</motion.div>
					{/* teks */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, delay: 0.3 }}
						viewport={{ once: true }}
						className="w-full"
					>
						<form className="space-y-6" onSubmit={handleSubmit}>
							<div>
								<label className="block mb-1 font-medium">
									Nama
								</label>
								<input
									type="text"
									name="nama"
									placeholder="Masukkan nama Anda"
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
									required
									value={formData.nama}
									onChange={(e) =>
										setFormData({
											...formData,
											nama: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<label className="block mb-1 font-medium">
									Email
								</label>
								<input
									type="email"
									name="email"
									placeholder="Alamat email aktif"
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
									required
									value={formData.email}
									onChange={(e) =>
										setFormData({
											...formData,
											email: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<label className="block mb-1 font-medium">
									Saran / Pertanyaan
								</label>
								<textarea
									name="question"
									rows="4"
									placeholder="Tulis saran/perpertanyaanan Anda..."
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
									required
									value={formData.pertanyaan}
									onChange={(e) =>
										setFormData({
											...formData,
											pertanyaan: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<button
									type="submit"
									className="w-full bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition font-semibold"
								>
									Kirim
								</button>
							</div>
						</form>
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
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default FAQSection;
