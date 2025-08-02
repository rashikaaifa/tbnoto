import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PopUp from './PopUp';

const PerluMasuk = ({ children }) => {
	const { isLoggedIn } = useAuth();
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		if (!isLoggedIn) setShowPopup(true);
	}, [isLoggedIn]);

	return (
		<>
			{!isLoggedIn && (
				<PopUp
					isOpen={showPopup}
					title="Masuk untuk melanjutkan akses!"
					message="Jangan lewatkan pengalaman  berbelanja terbaik."
					icon="warning"
					actionLabel="Masuk"
					actionHref="/daftar"
					hideClose={true}
				/>
			)}
			{children}
		</>
	);
};

export default PerluMasuk;
