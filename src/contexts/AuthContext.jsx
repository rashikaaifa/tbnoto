import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('https://tbnoto19-admin.rplrus.com/api/auth/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data?.id) {
          setUser(data);
        } else {
          throw new Error('Token tidak valid');
        }
      } catch (err) {
        console.error('Auth error:', err.message);
        logout(); // reset semua jika error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    try {
      await fetch('https://tbnoto19-admin.rplrus.com/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }
  };

  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
