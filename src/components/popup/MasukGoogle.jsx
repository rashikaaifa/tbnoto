import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MasukGoogle = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(5);

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
                <h2 className="text-xl font-bold text-gray-800">Himbauan!</h2>
                <p className="text-gray-600 mt-2">Mohon lengkapi profil Anda melalui tombol di bawah ini.</p>

                {/* button */}
                <div className="mt-6 space-y-3">
                <a
                    href="/"
                    className="block w-full text-center bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition"
                >
                    Lengkapi Profil ({countdown})
                </a>
                </div>
                
            </motion.div>
        </div>
  );
};

export default MasukGoogle;