import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const PaginationControl = ({
	currentPage,
	totalPages,
	onPageChange,
	onNext,
	onPrev,
}) => {
	return (
		<div className="flex justify-center items-center mt-10 space-x-2 text-sm mb-6">
			<span className="text-gray-700">Halaman</span>

			<div className="relative inline-block">
				<select
					value={currentPage}
					onChange={(e) => onPageChange(Number(e.target.value))}
					className="border border-gray-300 rounded-md px-3 pr-8 py-1.5 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
				>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(page) => (
							<option key={page} value={page}>
								{page}
							</option>
						)
					)}
				</select>
				<div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-600"></div>
			</div>

			<span className="text-gray-700">dari {totalPages}</span>

			<button
				onClick={onPrev}
				disabled={currentPage === 1}
				className={`rounded-full p-2 text-white transition duration-200 ${
					currentPage === 1
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-primary'
				}`}
			>
				<HiChevronLeft size={18} />
			</button>

			<button
				onClick={onNext}
				disabled={currentPage === totalPages}
				className={`rounded-full p-2 text-white transition duration-200 ${
					currentPage === totalPages
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-primary'
				}`}
			>
				<HiChevronRight size={18} />
			</button>
		</div>
	);
};

export default PaginationControl;
