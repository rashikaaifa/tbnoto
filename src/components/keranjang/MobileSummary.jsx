import React from 'react';

const MobileSummary = ({
	summary,
	isExpanded,
	onToggle,
	disabled,
	onCheckout,
	loading,
}) => {
	return (
		<div className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50 rounded-t-lg">
			{/* Bar rangkuman harga */}
			<div className="px-3 py-2 flex justify-between items-center border-b border-gray-100">
				<div className="flex items-center gap-2">
					<span className="font-medium text-sm text-gray-600">
						Total:
					</span>
					<span className="font-bold text-base text-green-800">
						Rp{summary.total.toLocaleString()}
					</span>
				</div>
				<button
					className="text-green-800 text-xs font-medium flex items-center gap-1 p-1"
					onClick={onToggle}
				>
					{isExpanded ? 'Tutup' : 'Detail'}
					<span className="text-xs">{isExpanded ? '▲' : '▼'}</span>
				</button>
			</div>

			{/* Detail ringkasan yang bisa diexpand */}
			<div
				className={`overflow-hidden transition-all duration-300 px-3 ${isExpanded ? 'max-h-28 py-2' : 'max-h-0'}`}
			>
				<div className="flex justify-between mb-1">
					<span className="text-xs text-gray-600">Total Item</span>
					<span className="text-xs font-medium">
						{summary.totalItems}
					</span>
				</div>
				<div className="flex justify-between mb-1">
					<span className="text-xs text-gray-600">Subtotal</span>
					<span className="text-xs font-medium">
						Rp{summary.subtotal.toLocaleString()}
					</span>
				</div>
				<div className="flex justify-between mb-1">
					<span className="text-xs text-gray-600">
						Ongkos Kirim (3%)
					</span>
					<span className="text-xs font-medium">
						{summary.shipping === 0
							? 'Gratis'
							: `Rp${summary.shipping.toLocaleString()}`}
					</span>
				</div>
			</div>

			{/* Tombol beli */}
			<div className="p-3 pt-2">
				<button
					className="bg-green-800 hover:bg-green-900 text-white w-full rounded-md py-2 px-4 text-sm font-semibold flex items-center justify-center gap-1 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
					disabled={disabled || loading}
					onClick={onCheckout}
				>
					{loading ? (
						'Memproses...'
					) : (
						<>
							<i className="text-sm">🛒</i> Beli Sekarang
						</>
					)}
				</button>
			</div>
		</div>
	);
};

export default MobileSummary;
