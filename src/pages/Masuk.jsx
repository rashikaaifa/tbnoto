import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Masuk = () => {
  const { login } = useAuth(); // Menggunakan context Auth untuk login
  const navigate = useNavigate(); 

  // State untuk form data dan error
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  // Fungsi handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fungsi handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.email || !formData.password) {
      setError('Email dan kata sandi harus diisi.');
      return;
    }

    // Kirim data login ke API
    try {
      const response = await fetch('https://tbnoto19-admin.rplrus.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token); // Simpan token dan login otomatis
        navigate('/'); // Redirect ke homepage setelah login berhasil
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="p-6 w-full max-w-sm bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Masuk</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Masukkan alamat email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Kata Sandi</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Masukkan kata sandi"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            className="w-full bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition font-semibold"
            type="submit"
          >
            Masuk
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <a href="/daftar" className="text-primary font-medium hover:underline">
            Daftar
          </a>
        </p>
      </div>
    </div>
  );
};

export default Masuk;
