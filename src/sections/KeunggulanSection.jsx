import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const keunggulan = [
	{
		title: 'Harga Terbaik',
		desc: 'Material berkualitas tinggi dengan harga terjangkau.',
	},
	{
		title: 'Fleksibel & Praktis',
		desc: 'Pemesanan mudah, bisa langsung di toko atau secara online.',
	},
	{
		title: 'Stok Lengkap',
		desc: 'Beragam material tersedia untuk proyek kecil hingga skala besar.',
	},
	{
		title: 'Pengiriman Kilat',
		desc: 'Cepat dan tepat waktu, langsung ke lokasi proyek Anda.',
	},
];

const KeunggulanSection = () => {
	return (
		<section id="keunggulan">
			<div className="p-6 md:p-12">
				<h2 className="text-4xl font-bold text-center mb-8">
					Keunggulan Kami
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{keunggulan.map((item, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.5,
								delay: index * 0.2,
							}}
							viewport={{ once: true }}
							className="p-6 bg-keunggulan text-primary rounded-xl shadow-xl flex flex-col items-center justify-center text-center space-y-3 transform hover:scale-105 transition-all duration-500 ease-in-out"
						>
							<FaCheckCircle className="text-4xl text-primary" />
							<h3 className="text-xl font-bold">{item.title}</h3>
							<p className="text-sm">{item.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default KeunggulanSection;
