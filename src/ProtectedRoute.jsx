import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PerluMasuk from './components/popup/PerluMasuk';

const ProtectedRoute = ({ children }) => {
	const token = localStorage.getItem('token');
	const [showPopup, setShowPopup] = useState(!token);

	if (!token) {
		return (
			<>
				<PerluMasuk
					show={showPopup}
					onClose={() => setShowPopup(false)}
				/>
				{!showPopup && <Navigate to="/masuk" replace />}
			</>
		);
	}

	return children;
};

export default ProtectedRoute;
