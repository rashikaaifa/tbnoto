// GagalFAQ.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const GagalFAQ = ({ isOpen }) => {
    const navigate = useNavigate();

    // CLUE: Disable scroll saat pop-up terbuka
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    const crossPath = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" },
        },
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
                {/* Icon silang (gagal) */}
                <div className="flex justify-center mb-4">
                    <svg
                        className="w-20 h-20 stroke-red-600 text-primary"
                        fill="none"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                    >
                        <motion.path
                            d="M6 6L18 18M6 18L18 6"
                            variants={crossPath}
                            initial="hidden"
                            animate="visible"
                        />
                    </svg>
                </div>

                {/* Judul dan pesan */}
                <h2 className="text-xl font-bold text-gray-800">Gagal Terkirim!</h2>
                <p className="text-gray-600 mt-2">Pesan gagal terkirim, periksa koneksi Anda.</p>

                {/* Tombol kembali */}
                <div className="mt-6 space-y-3">
                    <a
                        href="/"
                        className="block w-full text-center bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition"
                    >
                        Tutup
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default GagalFAQ;
