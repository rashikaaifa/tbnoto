import React, { useState } from 'react';
import faqImage from '../assets/img/bntuan.jpg';

const faqs = [
	{
		question: 'Bagaimana cara memesan produk?',
		answer: 'Anda bisa memesan produk dengan menambahkannya ke keranjang dan melakukan checkout.',
	},
	{
		question: 'Bagaimana cara melakukan pembayaran?',
		answer: 'Pembayaran dapat dilakukan melalui transfer bank atau metode lain yang tersedia di website.',
	},
	{
		question: 'Bagaimana cara mengatur ulang password akun?',
		answer: "Klik 'Lupa Password' di halaman login dan ikuti langkah-langkahnya.",
	},
	{
		question:
			'Bagaimana cara mengemas paket untuk dikembalikan ke penjual?',
		answer: 'Pastikan paket dalam kondisi baik, lalu hubungi penjual untuk petunjuk lebih lanjut.',
	},
	{
		question: 'Apakah katalog di website sama seperti di offline store?',
		answer: 'Katalog di website bisa berbeda dengan offline store karena stok bisa berubah sewaktu-waktu.',
	},
	{
		question: 'Bagaimana cara konsultasi ke penjual?',
		answer: 'Anda bisa menghubungi penjual melalui WhatsApp atau fitur Whatsapp yang tersedia di website.',
	},
];

const Bantuan = () => {
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<div className="mt-2 px-4 w-full min-h-[calc(100vh-60px)] flex flex-col items-center px-4 py-8 sm:py-12">
			<h1 className="text-2xl sm:text-4xl font-bold mt-16 mb-6 mr-0 lg:mr-24 w-full sm:w-4/5 text-left">
				Bantuan
			</h1>

			<div className="flex flex-col lg:flex-row justify-between items-start gap-8 w-full sm:w-4/5 max-w-[1400px]">
				<div className="flex justify-center items-start lg:w-2/5 w-full">
					<img
						src={faqImage}
						alt="FAQ Illustration"
						className="w-full max-w-sm"
					/>
				</div>

				<div className="flex flex-col lg:w-3/5 w-full">
					{faqs.map((faq, index) => (
						<div
							key={index}
							className="border-b-2 border-gray-300 p-4 mb-2 cursor-pointer hover:bg-keunggulan hover:rounded-xl transition-all"
							onClick={() => toggleFAQ(index)}
						>
							<div className="flex justify-between items-center font-semibold text-base sm:text-lg">
								{faq.question}
								<button className="text-[#7a0000] text-xl font-bold ml-4">
									{openIndex === index ? '−' : '+'}
								</button>
							</div>
							{openIndex === index && (
								<p className="mt-2 text-sm sm:text-base pl-2 leading-relaxed">
									{faq.answer}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Bantuan;
