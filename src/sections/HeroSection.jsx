import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
	const [currentPoster] = useState(0);

	const mobileImages = [
		'/assets/hero/mobile1.webp',
		'/assets/hero/mobile2.webp',
		'/assets/hero/mobile3.webp',
	];

	const desktopImages = [
		'/assets/hero/desktop1.webp',
		'/assets/hero/desktop2.webp',
		'/assets/hero/desktop3.webp',
	];

	return (
		<section id="hero">
			<div className="relative w-full">
				<div className="relative w-full h-screen">
					<div className="absolute inset-0 w-full h-full overflow-hidden">
						{/* gambar mobile */}
						{mobileImages.map((img, index) => (
							<motion.img
								key={`mobile-${index}`}
								src={img}
								alt={`Mobile Slide ${index}`}
								className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
									index === currentPoster
										? 'opacity-100'
										: 'opacity-0'
								} md:hidden`}
							/>
						))}
						{/* gambar desktop */}
						{desktopImages.map((img, index) => (
							<motion.img
								key={`desktop-${index}`}
								src={img}
								alt={`Desktop Slide ${index}`}
								className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
									index === currentPoster
										? 'opacity-100'
										: 'opacity-0'
								} hidden md:block`}
							/>
						))}
						<div className="absolute inset-0 bg-black/50"></div>
					</div>
					{/* teks */}
					<div className="relative flex flex-col items-center justify-center h-full text-center px-4">
						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1 }}
							className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg"
						>
							TB. NOTO 19
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, delay: 0.3 }}
							className="text-lg md:text-xl text-white mt-4 font-light drop-shadow-lg"
						>
							Bancak, Payaman, Kec. Mejobo, Kabupaten Kudus, Jawa
							Tengah
						</motion.p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;