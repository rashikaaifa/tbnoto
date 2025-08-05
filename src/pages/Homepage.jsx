import React from 'react';
import HeroSection from '../sections/HeroSection';
import IntroSection from '../sections/IntroSection';
import KeunggulanSection from '../sections/KeunggulanSection';
import KategoriSection from '../sections/KategoriSection';
import TopProdukSection from '../sections/TopProdukSection';
import ProdukSection from '../sections/ProdukSection';
import PosterSection from '../sections/PosterSection';
import FAQSection from '../sections/FAQSection';
import LokasiSection from '../sections/LokasiSection';

const Homepage = () => {
	return (
		<div className="relative w-full">
			<HeroSection />

			<IntroSection />

			<KeunggulanSection />

			<KategoriSection />

			<TopProdukSection />

			<ProdukSection />

			<PosterSection />

			<FAQSection />

			<LokasiSection />
			<br />
		</div>
	);
};

export default Homepage;