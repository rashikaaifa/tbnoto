import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PopUp = ({
  isOpen,
  onClose,
  title = "Judul",
  message = "Isi pesan",
  icon = "check",
  showClose = true,
  countdown = null,
  redirectTo = null,
  actionLabel = null,
  actionHref = null,
  children,
}) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(countdown);

  // Disable scrolling saat popup terbuka
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  // Jalankan countdown
  useEffect(() => {
    if (!isOpen || countdown === null) return;

    setTimer(countdown); // reset timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdown]);

  // Redirect ketika timer habis
  useEffect(() => {
    if (timer === 0 && redirectTo) {
      navigate(redirectTo);
    }
  }, [timer, redirectTo, navigate]);

  if (!isOpen) return null;

  const getIconPath = () => {
    switch (icon) {
      case "check": return "M5 13l4 4L19 7";
      case "cross": return "M6 6L18 18M6 18L18 6";
      case "warning": return "M12 9v2m0 4h.01M12 5.5l6.16 10.5H5.84L12 5.5z";
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-6">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center relative"
      >
        {/* close icon */}
        {showClose && (
          <button className="absolute top-3 right-3 hover:text-gray-800" onClick={onClose}>
            <IoClose className="text-2xl" />
          </button>
        )}

        {/* animation */}
        {icon && (
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
                d={getIconPath()}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </svg>
          </div>
        )}

        {/* judul & pesan */}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>

        {/* button */}
        {actionLabel && actionHref && (
          <div className="mt-6 space-y-3">
            <a
              href={actionHref}
              className="block w-full text-center bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition"
            >
              {actionLabel}
              {countdown !== null && timer > 0 ? ` (${timer})` : ""}
            </a>
          </div>
        )}

        {/* children */}
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PopUp;
