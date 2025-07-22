import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const HarapMasuk = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
        document.body.classList.add("overflow-hidden");
        } else {
        document.body.classList.remove("overflow-hidden");
        }

        return () => {
        document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    const handleDaftar = () => {
        navigate("/daftar");
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-xl p-6 w-96 text-center relative"
            >
                {/* close */}
                <button className="absolute top-3 right-3 hover:text-gray-800" onClick={onClose}>
                    <IoClose className="text-2xl" />
                </button>

                <br />

                {/* judul */}
                <h2 className="text-xl font-bold text-gray-800">Jangan lewatkan pengalaman  berbelanja terbaik!</h2>
                <p className="text-gray-600 mt-2">Masuk untuk melanjutkan akses.</p>
                
                {/* button */}
                <div className="mt-6 space-y-3">
                <a
                    href="/daftar"
                    className="block w-full text-center bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition"
                >
                    Daftar
                </a>
                    <p className="text-center text-gray-700">
                        Sudah memiliki akun?{" "}
                        <a href="/masuk" className="text-primary underline">
                            Masuk
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
  );
};

export default HarapMasuk;