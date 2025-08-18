import React, { useState, useEffect } from 'react';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaFacebook } from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';

const Footer = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1024); // kondisi mobile
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<footer className="bg-primary text-white py-8 pb-0 text-base lg:text-sm">
			{/* versi desktop */}
			{!isMobile && (
				<div className="container mx-auto px-6 lg:px-28 flex flex-col lg:flex-row justify-between items-center lg:items-start">
					{/* teks nama & alamat */}
					<div className="text-center lg:text-left flex flex-col items-center lg:items-start">
						<h2 className="text-xl font-bold mb-2">TB. NOTO 19</h2>
						<p className="text-sm leading-relaxed">
							Bancak, Payaman, Kec. Mejobo, <br />
							Kabupaten Kudus, Jawa Tengah
						</p>
					</div>
					{/* bagian produk */}
					<div className="mt-6 mb-8 lg:mt-0 text-center lg:text-left">
						<h3 className="text-lg font-medium mb-2">Produk</h3>
						<ul className="space-y-1">
							<li>
								<a href="#kategori" className="">
									Kategori
								</a>
							</li>
							<li>
								<a href="/katalog" className="">
									Katalog
								</a>
							</li>
						</ul>
					</div>
					{/* bagian menu */}
					<div className="mt-6 lg:mt-0 text-center lg:text-left">
						<h3 className="text-lg font-medium mb-2">Menu</h3>
						<ul className="space-y-1">
							<li>
								<a href="/keranjang" className="">
									Keranjang
								</a>
							</li>
							<li>
								<a href="/riwayat" className="">
									Riwayat
								</a>
							</li>
							<li>
								<a href="/bantuan" className="">
									Bantuan
								</a>
							</li>
						</ul>
					</div>
					{/* kontak */}
					<div className="mt-6 lg:mt-0 text-center lg:text-left">
						<h3 className="text-lg font-medium mb-2">Kontak</h3>
						<ul className="">
							<li className="flex items-center gap-2 justify-center lg:justify-start">
								<a
									href="https://wa.me/62882003826565"
									className="flex items-center gap-2"
									target="_blank"
									rel="noopener noreferrer"
								>
									<span>
										<button className="text-2xl p-2">
											<IoLogoWhatsapp />
										</button>
									</span>
									<span className="align-middle">
										0882003826565
									</span>
								</a>
							</li>
							<li className="flex items-center gap-2 justify-center lg:justify-start">
								<a
									href="https://www.facebook.com/sumadi.679727"
									className="flex items-center gap-2"
									target="_blank"
									rel="noopener noreferrer"
								>
									<span>
										<button className="text-2xl p-2">
											<FaFacebook />
										</button>
									</span>
									<span className="align-middle">
										sumadi.679727
									</span>
								</a>
							</li>
							<li className="flex items-center gap-2 justify-center lg:justify-start">
								<a
									href="https://www.tiktok.com/@sumadisumadi8655"
									className="flex items-center gap-2"
									target="_blank"
									rel="noopener noreferrer"
								>
									<span>
										<button className="text-2xl p-2">
											<AiFillTikTok />
										</button>
									</span>
									<span className="align-middle">
										sumadisumadi8655
									</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			)}

			{/* versi mobile */}
			{isMobile && (
				<div className="flex flex-col items-center text-center mt-0 space-y-4">
					<div className="text-center items-center">
						<h2 className="text-xl font-bold mb-2">TB. NOTO 19</h2>
						<p className="text-sm leading-relaxed mb-4">
							Bancak, Payaman, Kec. Mejobo, Kabupaten <br />
							Kudus, Jawa Tengah
						</p>
					</div>
					<ul className="flex flex-wrap justify-center gap-4 p-2">
						{[
							'Kategori',
							'Katalog',
							'Keranjang',
							'Riwayat',
							'Bantuan',
							'Profil',
						].map((item, index) => (
							<li key={index}>
								<a href="#" className="">
									{item}
								</a>
							</li>
						))}
					</ul>
					{/* kontak */}
					<div className="flex space-x-4">
						<a
							href="https://wa.me/62882003826565"
							className="text-xl transition"
							target="_blank"
							rel="noopener noreferrer"
						>
							<IoLogoWhatsapp />
						</a>
						<a
							href="https://www.facebook.com/sumadi.679727"
							className="text-xl transition"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaFacebook />
						</a>
						<a
							href="https://www.tiktok.com/@sumadisumadi8655"
							className="text-xl transition"
							target="_blank"
							rel="noopener noreferrer"
						>
							<AiFillTikTok />
						</a>
					</div>
				</div>
			)}

			{/* copyright */}
			<div className="bg-black text-center text-white py-4 mt-4">
				<p className="text-sm">
					Copyright © 2025{' '}
					<a href="/" className="text-blue-400 ">
						Tambah Barokah
					</a>
					. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
