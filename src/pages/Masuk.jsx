import React from "react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa6";
import { motion } from "framer-motion";
import bgImage from '../assets/img/background.png';
import { useNavigate } from "react-router-dom";

const Masuk = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/");
    };
    
    return (
        <div
        className="min-h-screen bg-cover bg-center px-8"
        style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="flex flex-col md:flex-row items-center py-20 md:items-start justify-center md:justify-end min-h-screen max-w-7xl mx-auto">
                <motion.div
                animate={{ opacity: 1, y: 1 }}
                className="p-6 w-full max-w-2xl md:mr-12 md:mt-6 flex flex-col"
                >
                <h2 className="text-xl md:text-3xl font-semibold mb-6">
                    Masuk ke Akun
                </h2>
                    <div className="max-h-[70vh] scrollbar-hide pr-1">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                                <label className="block mb-1">Nomor Telepon</label>
                                <input
                                    type="number"
                                    name="phone_number"
                                    placeholder="Masukkan nomor telepon aktif"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Kata Sandi</label>
                                <input
                                    type="password"
                                    name="password"
                                    minLength={8}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Konfirmasi Kata Sandi</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Konfirmasi kata sandi"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
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
                            {[<FcGoogle />, <IoLogoApple />, <FaFacebook />].map((icon, index) => (
                                <a key={index} href="#" className="text-xl">{icon}</a>
                            ))}
                        </div>
                        <p className="text-sm text-center mt-4">
                            Belum punya akun? <a href="/daftar" className="text-primary font-medium hover:underline">Daftar</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
  );
};

export default Masuk;