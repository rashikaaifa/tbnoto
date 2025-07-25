import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const BASE_URL = 'https://tbnoto19-admin.rplrus.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const fetchProfile = async (t) => {
    try {
      const res = await fetch(`${BASE_URL}/profile`, {
        method: 'GET', // GUNAKAN GET jika memang backend support
        headers: {
          'Authorization': `Bearer ${t}`,
          'Accept': 'application/json',
        },
      });
      const data = await res.json();
      console.log('RESPON PROFILE:', data); // Debug
      if (res.ok && data.data) {
        setUser(data.data);
      } else {
        console.error('Gagal memuat profil:', data.message || data);
        setUser(null);
      }
    } catch (error) {
      console.error('Error saat feact profil:', error);
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

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
