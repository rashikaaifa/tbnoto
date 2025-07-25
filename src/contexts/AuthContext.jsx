// contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const BASE_URL = 'https://tbnoto19-admin.rplrus.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

const fetchProfile = async (t) => {
    try {
      const res = await fetch(`${BASE_URL}/profile`, {
        method: 'GET', // ✅ Perbaikan di sini
        headers: {
          'Authorization': `Bearer ${t}`,
          'Accept': 'application/json',
        },
      });
      const data = await res.json();
      console.log('RESPON PROFILE:', data);
      if (res.ok && (data.data || data.user || data.id)) {
        setUser(data.data || data.user || data);
      } else {
        console.error('Gagal memuat profil:', data.message || data);
        setUser(null);
      }     

    } catch (error) {
      console.error('Error saat fetch profil:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
};


  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
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
      },
    }).finally(() => {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    });
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch(`${BASE_URL}/profile`, {
        method: 'PUT', // ganti jika backendmu PATCH/PUT
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setUser(data.data);
        console.log('Profil berhasil diperbarui:', data.data);
      } else {
        console.error('Gagal memperbarui profil:', data.message || data);
      }
    } catch (error) {
      console.error('Error saat update profil:', error);
    }
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
