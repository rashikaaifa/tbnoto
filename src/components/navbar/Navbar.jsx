import React, { useState, useEffect, useRef } from 'react';
import { HiBuildingStorefront } from "react-icons/hi2";
import { IoMenu, IoChevronDown } from "react-icons/io5";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dropdownRef = useRef(null);
    const mobileDropdownRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false); 
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    const NavbarMenu = [
        { id: 1, title: "Kategori", link: "#" },
        { id: 2, title: "Katalog Produk", link: "/katalog" },
        { id: 3, title: "Riwayat", link: "/riwayat" },
        { id: 4, title: "Bantuan", link: "/bantuan" },
    ];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight - 100 || location.pathname !== '/') {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
                setMobileDropdownOpen(false);
            }
        };
        if (mobileDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileDropdownOpen]);

    const isHomepage = location.pathname === '/';

    return (
        <div className="relative">
            {/* navbar */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                (isMobile || isScrolled || !isHomepage) ? "bg-primary" : "bg-transparent"
            }`}>
                <div className="container flex justify-between items-center py-4 px-4 md:px-8">
                    {/* logo */}
                    <div className="text-2xl flex items-center gap-4 font-bold uppercase text-white">
                        <HiBuildingStorefront />
                        <a href="/">TB. NOTO 19</a>
                    </div>

                    {/* versi desktop */}
                    <div className="hidden md:flex text-white items-center gap-6 font-regular">
                        {NavbarMenu.map((item) => (
                            item.title === "Kategori" ? (
                                <div key={item.id} className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-1 py-1 px-3 border-b-2 border-transparent hover:border-white transition duration-300"
                                    >
                                        {item.title}
                                        <IoChevronDown className={`text-lg transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* dropdown */}
                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-white text-black rounded-lg shadow-lg overflow-hidden"
                                            >
                                                <ul className="flex flex-col py-2 font-light">
                                                    {["Kayu", "Besi", "Paralon", "Paku", "Semen", "Kanopi"].map((category, index) => (
                                                        <li key={index} className="hover:bg-gray-200 px-4 py-2 text-center">
                                                            <a href="#">{category}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <a 
                                    key={item.id} 
                                    href={item.link} 
                                    className="inline-block py-1 px-3 border-b-2 border-transparent hover:border-white transition duration-300"
                                >
                                    {item.title}
                                </a>
                            )
                        ))}
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-white">
                        <a href="/keranjang">
                            <button className="text-2xl hover:bg-white hover:text-primary rounded-full p-2 mr-4">
                                <FaShoppingCart />
                            </button>
                        </a>

                        {!isLoggedIn ? (
                            <button 
                                onClick={() => setIsLoggedIn(true)} 
                                className="font-medium bg-white text-primary px-4 py-2 rounded-full border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition"
                            >
                                Daftar / Masuk
                            </button>
                        ) : (
                            <button className="text-2xl hover:bg-white hover:text-primary rounded-full p-2 mr-8">
                                <FaUser />
                            </button>
                        )}
                    </div>

                    {/* hamburger */}
                    <div className="md:hidden flex items-center gap-4 text-white">
                        <button onClick={() => setOpen(!open)}>
                            <motion.div 
                                initial={{ rotate: 0 }}
                                animate={{ rotate: open ? 90 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <IoMenu className="text-4xl" />
                            </motion.div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* versi mobile */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed top-16 left-0 w-full bg-white text-black shadow-lg rounded-b-lg overflow-hidden z-40"
                    >
                        <ul className="flex flex-col text-center">
                            {/* dropdown */}
                            <li ref={mobileDropdownRef} className="relative">
                                <button
                                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                                    className="w-full flex items-center justify-center p-4 border-b bg-white hover:bg-gray-100"
                                >
                                    <motion.span
                                        initial={{ opacity: 1, x: 0 }}
                                        animate={{
                                            opacity: 1,
                                            x: mobileDropdownOpen ? "-230%" : "0%",
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Kategori
                                    </motion.span>
                                    <IoChevronDown
                                        className={`absolute right-4 text-lg transition-transform duration-300 ${
                                            mobileDropdownOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {mobileDropdownOpen && (
                                        <motion.ul
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden bg-gray-100 text-black"
                                        >
                                            {["Kayu", "Besi", "Paralon", "Paku", "Semen", "Kanopi"].map(
                                                (category, index) => (
                                                    <li
                                                        key={index}
                                                        className="px-6 py-3 text-left hover:bg-gray-200 border-b last:border-none"
                                                    >
                                                        <a href="#">{category}</a>
                                                    </li>
                                                )
                                            )}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </li>

                            <li className="p-4 border-b hover:bg-gray-200"><a href="/katalog">Katalog Produk</a></li>
                            <li className="p-4 border-b hover:bg-gray-200"><a href="/riwayat">Riwayat</a></li>
                            <li className="p-4 border-b hover:bg-gray-200"><a href="/bantuan">Bantuan</a></li>
                            <li className="p-4 border-b hover:bg-gray-200"><a href="/profil">Profil</a></li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;