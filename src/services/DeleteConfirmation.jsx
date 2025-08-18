import React from 'react';

const DeleteConfirmation = ({ productName, onConfirm, onCancel }) => {
	return (
		<div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-xl w-[90%] max-w-[350px] text-center shadow-lg animate-[modalFadeIn_0.3s_ease] sm:p-5">
				<p className="mb-5 text-base font-medium text-gray-800 sm:text-sm">
					Apakah Anda yakin ingin menghapus{' '}
					<strong>{productName}</strong> dari keranjang?
				</p>
				<div className="flex justify-center gap-4 sm:gap-2">
					<button
						className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg text-sm font-medium cursor-pointer transition-all hover:translate-y-[-1px] sm:py-2.5 sm:px-5 sm:text-xs"
						onClick={onConfirm}
					>
						Hapus
					</button>
					<button
						className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-sm font-medium cursor-pointer transition-all border border-gray-300 sm:py-2.5 sm:px-5 sm:text-xs"
						onClick={onCancel}
					>
						Batal
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmation;
