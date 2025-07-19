import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import bgImage from '../assets/img/background.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Masuk = () => {
  const { login } = useAuth(); // menggunakan context Auth
  const navigate = useNavigate(); 

  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });

  // State untuk error
  const [error, setError] = useState('');

  // Fungsi handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  // Fungsi handle submit form
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('https://tbnoto19-admin.rplrus.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone: formData.phone_number,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      login(data.token); // simpan token di context
      navigate('/'); // redirect ke homepage
    } else {
      setError(data.message || 'Login gagal. Periksa nomor dan password.');
    }
  } catch (err) {
    console.error(err);
    setError('Terjadi kesalahan saat login');
  }
};


  return (
    <div
      className="min-h-screen bg-cover bg-center px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
<div className="flex flex-col md:flex-row items-center justify-end min-h-screen max-w-7xl mx-auto px-4">
        <motion.div
          animate={{ opacity: 1, y: 1 }}
          className="p-6 w-full max-w-2xl md:mr-12 md:mt-8 flex flex-col"
        >
          <h2 className="text-xl md:text-3xl font-semibold mb-6">
            Masuk ke Akun
          </h2>
          <div className="max-h-[70vh] scrollbar-hide pr-1">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
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
                <label className="block mb-1">Kata Sandi</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  minLength={8}
                  placeholder=""
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
                Masuk
              </button>    
            </form>
          </div>
          <div>
            <div className="relative text-center">
              <span className="bg-white px-2 z-10 relative">atau masuk menggunakan</span>
              <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gray-400 -z-0"></div>
            </div>
            <div className="flex justify-center items-center space-x-4 mt-4">
              {[<FcGoogle />,].map((icon, index) => (
                <a key={index} href="#" className="text-xl">{icon}</a>
              ))}
            </div>
            <p className="text-sm text-center mt-4">
              Belum memiliki akun? <a href="/daftar" className="text-primary font-medium hover:underline">Daftar</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Masuk;
