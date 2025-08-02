import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { HiBuildingStorefront } from "react-icons/hi2";
import { IoMenu, IoChevronDown } from "react-icons/io5";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { isLoggedIn } = useAuth();
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
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

    const filteredMenu = NavbarMenu.filter(item => {
    if (item.title === "Riwayat" && !isLoggedIn) return false;
    return true;
  });

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
                        {filteredMenu.map((item) => (
                            item.title === "Kategori" ? (
                                <a 
                                key={item.id}
                                href="/#kategori" // scroll ke section kategori di homepage
                                className="inline-block py-1 px-3 border-b-2 border-transparent hover:border-white transition duration-300"
                                >
                                {item.title}
                                </a>
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
                        {isLoggedIn && (
                            <a href="/keranjang">
                            <button className="text-2xl hover:bg-white hover:text-primary rounded-full p-2 mr-4">
                                <FaShoppingCart />
                            </button>
                            </a>
                        )}
                        
                        {!isLoggedIn ? (
                            <a href="/daftar">
                            <button className="font-medium bg-white text-primary px-4 py-2 rounded-full border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition">
                                Registrasi
                            </button>
                            </a>
                        ) : (
                            <div className="flex items-center gap-4">
                            <a href="/profil">
                                <button className="text-2xl hover:bg-white hover:text-primary rounded-full p-2">
                                <FaUser />
                                </button>
                            </a>
                            </div>
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
                                    onClick={() => {
                                    setOpen(false);
                                    window.location.href = "/#kategori";
                                    }}
                                    className="w-full flex items-center justify-center p-4 border-b bg-white hover:bg-gray-100"
                                >
                                    Kategori
                                </button>
                                
                                <a href="/#keunggulan">
                                </a>
                                
                            </li>

                            <li className="p-4 border-b hover:bg-gray-200"><a href="/katalog">Katalog Produk</a></li>
                            {isLoggedIn && (
                            <li className="p-4 border-b hover:bg-gray-200"><a href="/riwayat">Riwayat</a></li>
                            )}
                            <li className="p-4 border-b hover:bg-gray-200"><a href="/bantuan">Bantuan</a></li>
                            {isLoggedIn ? (
                                <li className="p-4 border-b hover:bg-gray-200">
                                <a href="/profil">Profil</a>
                                </li>
                            ) : (
                                <li className="p-4 border-b hover:bg-gray-200">
                                <a href="/masuk">Masuk / Register</a>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>  
    );
};

export default Navbar;