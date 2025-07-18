import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Masuk = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone_number: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!formData.email || !formData.password) {
    setError('Email dan kata sandi wajib diisi.');
    return;
  }

  try {
    const response = await fetch('https://tbnoto19-admin.rplrus.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        phone: formData.phone_number
      })
    });

    const data = await response.json();
    console.log("Login Response:", data); // <-- tambahkan untuk debug

    if (response.ok && data.token) {
      login(data.token);
      navigate('/');
    } else {
      setError(data.message || 'Email atau kata sandi salah.');
    }
  } catch (err) {
    console.error(err);
    setError('Terjadi kesalahan jaringan.');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Masuk</h2>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            placeholder="Email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Kata Sandi</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            placeholder="Kata Sandi"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-xl hover:bg-opacity-90 font-semibold"
        >
          Masuk
        </button>

        <p className="text-sm text-center mt-4">
          Belum punya akun? <a href="/daftar" className="text-primary hover:underline font-medium">Daftar</a>
        </p>
      </form>
    </div>
  );
};

export default Masuk;
