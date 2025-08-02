import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const BASE_URL = 'https://tbnoto19-admin.rplrus.com/api';

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('token') || null);
	const [isAuthLoading, setIsAuthLoading] = useState(false);

	const clearAuth = () => {
		localStorage.removeItem('token');
		setUser(null);
		setToken(null);
	};

	const fetchProfile = async (t) => {
		if (!t) return;
		setIsAuthLoading(true);
		try {
			const res = await fetch(`${BASE_URL}/profile`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${t}`,
					Accept: 'application/json',
				},
			});

			let data = null;
			try {
				data = await res.json();
			} catch (_) {
				data = null;
			}

			if (res.ok && (data?.data || data?.user || data?.id)) {
				setUser(data.data || data.user || data);
			} else {
				console.error('Gagal memuat profil:', data?.message || data);
				clearAuth();
			}
		} catch (error) {
			console.error('Error saat fetch profil:', error);
			clearAuth();
		} finally {
			setIsAuthLoading(false);
		}
	};

	useEffect(() => {
		if (token) fetchProfile(token);
	}, [token]);

	const login = async (newToken) => {
		localStorage.setItem('token', newToken);
		setToken(newToken);
		await fetchProfile(newToken);
	};

	const logout = () => {
		fetch(`${BASE_URL}/auth/logout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		}).finally(() => {
			clearAuth();
		});
	};

	const updateProfile = async (profileData) => {
		try {
			const res = await fetch(`${BASE_URL}/profile`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(profileData),
			});
			const data = await res.json();
			if (res.ok && data?.data) {
				setUser(data.data);
				console.log('Profil berhasil diperbarui:', data.data);
			} else {
				console.error(
					'Gagal memperbarui profil:',
					data?.message || data
				);
			}
		} catch (error) {
			console.error('Error saat update profil:', error);
		}
	};

	const isLoggedIn = Boolean(token && user);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				logout,
				isLoggedIn,
				isAuthLoading,
				updateProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
