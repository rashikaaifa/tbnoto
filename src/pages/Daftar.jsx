import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa6";
import { motion } from "framer-motion";
import bgImage from '../assets/img/background.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Daftar = () => {
  const { login } = useAuth(); // menggunakan context Auth
  const navigate = useNavigate(); 

  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // State untuk error
  const [error, setError] = useState('');

  // Fungsi handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setError('Konfirmasi kata sandi tidak cocok.');
      } else {
        setError('');
      }
    }
  };

  // Fungsi handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi password
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordPattern.test(formData.password)) {
      setError('Kata sandi harus mengandung minimal 1 huruf kapital dan 1 angka.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi harus sama dengan kata sandi.');
      return;
    }

    // Kirim data ke API
    try {
      const response = await fetch('https://tbnoto19-admin.rplrus.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone_number,
          address: formData.address,
          password: formData.password,
          confirmpassword: formData.confirmpassword,
          password_confirmation: formData.confirmPassword,
        }),
    });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        navigate('/'); 
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-end min-h-screen max-w-7xl mx-auto">
        <motion.div
          animate={{ opacity: 1, y: 1 }}
          className="p-6 w-full max-w-2xl md:mr-12 md:mt-8 flex flex-col"
        >
          <h2 className="text-xl md:text-3xl font-semibold mb-6">
            Buat Akun Baru
          </h2>
          <div className="max-h-[70vh] scrollbar-hide pr-1">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1">Nama</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan alamat email aktif"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="block mb-1">
                <label className="block mb-1">Nomor Telepon</label>
                <div className="relative flex items-center">
                  <span className="absolute left-0 pl-4 text-gray-800">+62</span>
                  <input
                    type="number"
                    name="phone_number"
                    placeholder="Contoh: 882003826565"
                    className="w-full pl-16 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Alamat</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Masukkan alamat rumah Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1">Kata Sandi</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  minLength={8}
                  placeholder="Mini: 8 karakter, 1 kapital, 1 angka"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Konfirmasi kata sandi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  onChange={handleChange}
                />
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <button
                className="md:col-span-2 mb-4 w-full bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition font-semibold"
                type="submit"
              >
                Daftar
              </button>    
            </form>
          </div>
          <div>
            <div className="relative text-center">
              <span className="bg-white px-2 z-10 relative">atau daftar menggunakan</span>
              <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gray-400 -z-0"></div>
            </div>
            <div className="flex justify-center items-center space-x-4 mt-4">
              {[<FcGoogle />, <IoLogoApple />, <FaFacebook />].map((icon, index) => (
                <a key={index} href="#" className="text-xl">{icon}</a>
              ))}
            </div>
            <p className="text-sm text-center mt-4">
              Sudah punya akun? <a href="/masuk" className="text-primary font-medium hover:underline">Masuk</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Daftar;
