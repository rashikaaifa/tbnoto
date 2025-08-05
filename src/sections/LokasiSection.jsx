import React from 'react';

const LokasiSection = () => {
	return (
		<section id="lokasi">
			<div className="p-6 md:p-12">
				<h2 className="text-3xl font-bold text-center mb-8">
					Lokasi Kami
				</h2>
				<div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
					<iframe
						title="Lokasi TB. NOTO 19"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.4451270601567!2d110.8718013!3d-6.837115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70c57da4e416c1%3A0xb6db9dbfb8d027fb!2sTB%20.NOTO%2019!5e0!3m2!1sen!2sid!4v1744418031831!5m2!1sen!2sid"
						width="100%"
						height="100%"
						allowFullScreen=""
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</div>
		</section>
	);
};

export default LokasiSection;
