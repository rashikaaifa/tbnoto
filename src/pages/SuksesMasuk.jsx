import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SuksesMasuk = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const token = query.get('token');

		if (token) {
			login(token);
			navigate('/profil');
		} else {
			navigate('/masuk');
		}
	}, []);

	return <p>Memproses akun Google...</p>;
};

export default SuksesMasuk;
