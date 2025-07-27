import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SuksesMasuk = ({ isOpen }) => {
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(4);

    // no scrolling
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

    // countdown
    useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
    }, [isOpen]);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/");
        }
    }, [countdown, navigate]);

        const checkmarkPath = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
        };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-2xl p-6 w-96 text-center"
            >
                
                {/* icon centang */}
                <div className="flex justify-center mb-4">
                <svg
                    className="w-20 h-20 stroke-primary text-primary"
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <motion.path
                    d="M5 13l4 4L19 7"
                    variants={checkmarkPath}
                    initial="hidden"
                    animate="visible"
                    />
                </svg>
                </div>
                
                {/* judul */}
                <h2 className="text-xl font-bold text-gray-800">Berhasil!</h2>
                <p className="text-gray-600 mt-2">Selamat datang dan selamat berbelanja.</p>
                
            </motion.div>
        </div>
  );
};

export default SuksesMasuk;