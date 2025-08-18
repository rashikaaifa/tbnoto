import React, { useState, useEffect } from 'react';
import faqImage from '../assets/img/bantuan.jpg';
import api from '../api/index';

const Bantuan = () => {
	const [faqs, setFaqs] = useState([]);
	const [openIndex, setOpenIndex] = useState(null);

	useEffect(() => {
		api.get('/bantuan')
			.then((res) => {
				const formatted = res.data.map((item) => ({
					pertanyaan: item.pertanyaan,
					jawaban: item.jawaban,
				}));
				setFaqs(formatted);
			})
			.catch((err) => {
				console.error('Fetch bantuan error:', err);
			});
	}, []);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<div className="mt-2 px-4 w-full min-h-[calc(100vh-60px)] flex flex-col items-center px-4 py-8 sm:py-12">
			<h1 className="text-2xl sm:text-4xl font-bold mt-16 mb-6 mr-0 lg:mr-24 w-full sm:w-4/5 text-left">
				Bantuan
			</h1>

			<div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8 w-full sm:w-4/5 max-w-[1800px]">
				<div className="flex justify-center items-start lg:w-2/5 w-full">
					<img
						src={faqImage}
						alt="FAQ Illustration"
						className="w-full max-w mr-4 lg:mr-24"
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
								{faq.pertanyaan}
								<button className="text-[#7a0000] text-xl font-bold ml-4">
									{openIndex === index ? '−' : '+'}
								</button>
							</div>
							{openIndex === index && (
								<p className="mt-2 text-sm sm:text-base pl-2 leading-relaxed">
									{faq.jawaban}
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
