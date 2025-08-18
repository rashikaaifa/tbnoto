import React from 'react';
import { motion } from 'framer-motion';
import perjalananImg from "../assets/img/tbnoto.webp";

const IntroSection = () => {
	return (
		<section id="intro">
			<div className="py-16 px-6 md:px-16">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
					{/* gambar */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7 }}
						viewport={{ once: true }}
						className="relative w-full flex justify-center"
					>
						<div className="w-full md:w-8/12 lg:w-7/12 aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-lg">
							<motion.img
								src={perjalananImg}
								alt="Perjalanan Usaha"
								className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-[1.05] hover:shadow-2xl"
							/>
						</div>
					</motion.div>
					{/* teks */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, delay: 0.3 }}
						viewport={{ once: true }}
						className="w-full text-center md:text-left"
					>
						<h2 className="text-4xl font-extrabold mb-4 leading-tight">
							Perjalanan Berdiri
						</h2>
						<p className="text-lg leading-relaxed">
							Berawal dari masa sulit saat pandemi Covid-19, kami
							kembali ke kampung halaman dan memulai usaha toko
							bangunan. Dari pencarian supplier ke berbagai
							pabrik, kami menemukan peluang besar di produk
							triplek dan menjadikannya fokus utama toko. Dengan
							nama{' '}
							<span className="text-primary font-semibold">
								TB. Noto 19
							</span>
							, kami hadir untuk menyediakan bahan bangunan
							berkualitas dengan harga yang lebih terjangkau.
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default IntroSection;