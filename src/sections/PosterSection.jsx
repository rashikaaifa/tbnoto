import React, { useState, useEffect } from 'react';
import poster1 from '../assets/img/poster1.webp';
import poster2 from '../assets/img/poster2.webp';
import poster3 from '../assets/img/poster3.webp';
import { FaChevronRight } from 'react-icons/fa6';
import { FaChevronLeft } from 'react-icons/fa6';

const posters = [
	{ id: 1, image: poster1, alt: 'Poster 1' },
	{ id: 2, image: poster2, alt: 'Poster 2' },
	{ id: 3, image: poster3, alt: 'Poster 3' },
];

const PosterSection = () => {
	const [currentPoster, setCurrentPoster] = useState(0);

	useEffect(() => {
		const posterInterval = setInterval(() => {
			setCurrentPoster((prev) => (prev + 1) % posters.length);
		}, 4000);
		return () => clearInterval(posterInterval);
	}, [posters.length]);

	// navigasi manual poster
	const nextSlide = () => {
		setCurrentPoster((prev) =>
			prev === posters.length - 1 ? 0 : prev + 1
		);
	};

	const prevSlide = () => {
		setCurrentPoster((prev) =>
			prev === 0 ? posters.length - 1 : prev - 1
		);
	};

	return (
		<section id="poster">
			<div className="p-6 md:p-12">
				<div className="relative w-full aspect-[8/3] md:h-auto overflow-hidden rounded-2xl shadow-xl">
					<div
						className="flex transition-transform duration-700 ease-in-out w-full h-full"
						style={{
							transform: `translateX(-${currentPoster * 100}%)`,
						}}
					>
						{posters.map((poster) => (
							<div
								key={poster.id}
								className="w-full h-full relative flex-shrink-0"
							>
								<img
									src={poster.image}
									alt={poster.alt}
									className="absolute inset-0 w-full h-full object-cover object-center"
								/>
							</div>
						))}
					</div>
					<div className="absolute inset-0 bg-black/20 z-20 pointer-events-none" />
					{/* button kiri */}
					<button
						onClick={prevSlide}
						className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition z-30"
					>
						<FaChevronLeft size={20} />
					</button>
					{/* button kanan */}
					<button
						onClick={nextSlide}
						className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition z-30"
					>
						<FaChevronRight size={20} />
					</button>
				</div>
			</div>
		</section>
	);
};

export default PosterSection;
