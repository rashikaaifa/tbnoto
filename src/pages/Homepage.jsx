import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import poster1 from "../assets/img/poster1.jpg"
import poster2 from "../assets/img/poster2.jpg"
import poster3 from "../assets/img/poster3.jpg"
import perjalananImg from "../assets/img/cth4.png";
import faq from "../assets/img/faqhome.png";

const keunggulan = [
    { title: "Harga Terbaik", desc: "Material berkualitas tinggi dengan harga terjangkau." },
    { title: "Fleksibel & Praktis", desc: "Pemesanan mudah, bisa langsung di toko atau secara online." },
    { title: "Stok Lengkap", desc: "Beragam material tersedia untuk proyek kecil hingga skala besar." },
    { title: "Pengiriman Kilat", desc: "Cepat dan tepat waktu, langsung ke lokasi proyek Anda." },    
];

const top = [
    { id: 1, name: "Papan", size: "2 meter x 80 cm", price: "Rp. 65.000 / lembar", image: "" },
    { id: 2, name: "Kaso", size: "4 cm x 6 cm x 4 meter", price: "Rp. 65.000 / ikat", image: "/img/kaso.jpg" },
    { id: 3, name: "Besi", size: "6 meter", price: "Rp. 65.000 / batang", image: "/img/besi.jpg" },
    { id: 4, name: "Paralon", size: "3 inch", price: "Rp. 30.000 / meter", image: "/img/paralon.jpg" },
    { id: 5, name: "Semen", size: "3 roda", price: "Rp. 65.000 / karung", image: "/img/semen.jpg" },
    { id: 6, name: "Kaso", size: "2 meter x 80 cm", price: "Rp. 65.000 / lembar", image: "/img/kaso.jpg" },
];

const posters = [
    { id: 1, image: poster1, alt: "Poster 1" },
    { id: 2, image: poster2, alt: "Poster 2" },
    { id: 3, image: poster3, alt: "Poster 3" },
];
  
const Homepage = () => {
    const [currentPoster, setCurrentPoster] = useState(0); // untuk section posters

    const [products, setProducts] = useState([]);

    const allowedIds = [1, 9, 6, 2, 5, 7];

    useEffect(() => {
        fetch("https://tbnoto19.rplrus.com/api/barang")
        .then((res) => res.json())
        .then((data) => {
            console.log("Data produk:", data);
            setProducts(data);
        })
        .catch((err) => console.error("Fetch error:", err));
    }, []);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("https://tbnoto19.rplrus.com/api/kategori")
            .then((res) => res.json())
            .then((data) => {
                console.log("Data kategori:", data);
                setCategories(data);
            })
            .catch((err) => console.error("Fetch kategori error:", err));
    }, []);

    const getKategoriName = (id) => {
        const kategori = categories.find((item) => item.id === id);
        return kategori ? kategori.nama_kategori : 'Tidak diketahui';
    };    

    const mobileImages = [
        "/assets/hero/mobile1.png",
        "/assets/hero/mobile2.png",
        "/assets/hero/mobile3.png",
    ];
      
    const desktopImages = [
        "/assets/hero/desktop1.png",
        "/assets/hero/desktop2.png",
        "/assets/hero/desktop3.png",
    ];

    useEffect(() => {
        const posterInterval = setInterval(() => {
          setCurrentPoster((prev) => (prev + 1) % posters.length);
        }, 4000);
        return () => clearInterval(posterInterval);
    }, [posters.length]);

    // navigasi manual poster
    const nextSlide = () => {
        setCurrentPoster((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentPoster((prev) => (prev === 0 ? posters.length - 1 : prev - 1));
    };

    // faq
    const [formData, setFormData] = useState({
        nama_pelanggan: "",
        email: "",
        tanya: "",
    });

    const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data:", formData);

    try {
        const response = await fetch("https://tbnoto19.rplrus.com/api/faq", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        });

        const result = await response.json();

        console.log("Status Code:", response.status);
        console.log("Response JSON:", result); // 👈 ini penting untuk lihat isi respon

        if (!response.ok) {
        // tampilkan error dari API jika ada
        throw new Error(result.message || "Gagal mengirim data.");
        }

        alert("Form berhasil dikirim!");
        setFormData({ nama_pelanggan: "", email: "", tanya: "" });
    } catch (error) {
        console.error("Submit Error:", error.message);
        alert("Terjadi kesalahan saat mengirim formulir.");
    }
    };

    return (
        <div className="relative w-full">
            {/* hero section */}
            <section id="hero">
                <div className="relative w-full h-screen">
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        {/* gambar mobile */}
                        {mobileImages.map((img, index) => (
                            <motion.img
                                key={`mobile-${index}`}
                                src={img}
                                alt={`Mobile Slide ${index}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                index === currentPoster ? "opacity-100" : "opacity-0"
                                } md:hidden`}
                            />
                        ))}
                        {/* gambar desktop */}
                        {desktopImages.map((img, index) => (
                            <motion.img
                                key={`desktop-${index}`}
                                src={img}
                                alt={`Desktop Slide ${index}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                index === currentPoster ? "opacity-100" : "opacity-0"
                                } hidden md:block`}
                            />
                        ))}
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                    {/* teks */}
                    <div className="relative flex flex-col items-center justify-center h-full text-center px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg"
                        >
                            TB. NOTO 19
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="text-lg md:text-xl text-white mt-4 font-light drop-shadow-lg"
                        >
                            Bancak, Payaman, Kec. Mejobo, Kabupaten Kudus, Jawa Tengah
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* perjalanan usaha */}
            <section id="perjalanan">
                <div className="py-16 px-6 md:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        {/* gambar */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            className="relative w-full flex justify-center"
                        >
                            <div className="w-full md:w-8/12 lg:w-7/12 aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-lg">
                                <motion.img
                                    src={perjalananImg}
                                    alt="Perjalanan Usaha"
                                    className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-[1.05] hover:shadow-2xl"
                                />
                            </div>
                        </motion.div>
                        {/* teks */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="w-full text-center md:text-left"
                        >
                            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                                Perjalanan Berdiri
                            </h2>
                            <p className="text-lg leading-relaxed">
                            Berawal dari masa sulit saat pandemi Covid-19, kami kembali ke kampung halaman dan memulai usaha toko bangunan. Dari pencarian supplier ke berbagai pabrik, kami menemukan peluang besar di produk triplek dan menjadikannya fokus utama toko.
                            Dengan nama <span className="text-primary font-semibold">TB. Noto-19</span>, kami hadir untuk menyediakan bahan bangunan berkualitas dengan harga yang lebih terjangkau.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* keunggulan usaha */}
            <section id="keunggulan">
                <div className="p-6 md:p-12">
                    <h2 className="text-4xl font-bold text-center mb-8">Keunggulan Kami</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {keunggulan.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="p-6 bg-keunggulan text-primary rounded-xl shadow-xl flex flex-col items-center justify-center text-center space-y-3 transform hover:scale-105 transition-all duration-500 ease-in-out"
                            >
                                <FaCheckCircle className="text-4xl text-primary" />
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* kategori produk */}
            <section id="kategori">
                <div className="p-6 md:p-12">
                    <h2 className="text-3xl font-bold text-center mb-8">Kategori</h2>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {categories.map((kategori) => (
                            <Link
                                key={kategori.id}
                                to={`/katalog/${kategori.nama_kategori.toLowerCase().replace(/\s+/g, '-')}`}
                                className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all duration-500 block"
                            >
                                <img
                                    src={`/assets/kategori/${kategori.nama_kategori.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                                    alt={kategori.nama_kategori}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">{kategori.nama_kategori}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* produk unggulan */}
            <section id="unggulan">
                <div className="p-6 md:p-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold">Produk Unggulan</h2>
                    </div>
                    {/* list produk */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
                        {products
                        .filter((product) => allowedIds.includes(product.id))
                        .map((product) => {
                            if (!product.id) return null;
                            const kategoriNama = getKategoriName(product.kategori_id);
                            return (
                                <Link
                                    to={`/product/${product.id}`}
                                    key={product.id}
                                    className="bg-white p-3 rounded-xl border shadow-md text-left cursor-pointer hover:scale-105 transition-all duration-500 block"
                                >
                                    <img
                                        src={`https://tbnoto19.rplrus.com/storage/${product.foto_barang}`}
                                        alt={product.nama_barang}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                    <h3 className="font-semibold text-lg">{product.nama_barang}</h3>
                                    <p className="text-sm">Kategori: {kategoriNama}</p>
                                    <p className="text-md">Rp{Number(product.harga).toLocaleString()}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* semua produk */}
            <section id="produk">
                <div className="p-6 md:p-12">
                    {/* teks "lihat semua" atas */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold">Semua Produk</h2>
                        <span className="text-sm cursor-pointer underline">
                            <a href="/katalog">
                                Lihat Semua ...
                            </a>
                        </span>
                    </div>
                    {/* list produk */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
                        {products
                        .slice(0, 12)
                        .map((product) => {
                            if (!product.id) return null;
                            const kategoriNama = getKategoriName(product.kategori_id);
                            return (
                                <Link
                                    to={`/product/${product.id}`}
                                    key={product.id}
                                    className="bg-white p-3 rounded-xl border shadow-md text-left cursor-pointer hover:scale-105 transition-all duration-500 block"
                                >
                                    <img
                                        src={`https://tbnoto19.rplrus.com/storage/${product.foto_barang}`}
                                        alt={product.nama_barang}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                    <h3 className="font-semibold text-lg">{product.nama_barang}</h3>
                                    <p className="text-sm">Kategori: {kategoriNama}</p>
                                    <p className="text-md">Rp{Number(product.harga).toLocaleString()}</p>
                                </Link>
                            );
                        })}
                    </div>
                    {/* teks "lihat semua" */}
                    <div className="mt-6 mb-6">
                        <a href="/katalog">
                        <div className="w-full bg-gray-200 text-center text-black py-3 rounded-xl border cursor-pointer hover:bg-gray-300 transition">
                                Lihat Semua ...
                        </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* poster */}
            <section id="poster">
                <div className="p-6 md:p-12">
                    <div className="relative w-full aspect-[16/9] md:h-[400px] overflow-hidden rounded-2xl shadow-xl">
                        <div
                            className="flex transition-transform duration-700 ease-in-out w-full h-full"
                            style={{ transform: `translateX(-${currentPoster * 100}%)` }}
                        >
                            {posters.map((poster) => (
                                <div key={poster.id} className="w-full h-full relative flex-shrink-0">
                                <img
                                    src={poster.image}
                                    alt={poster.alt}
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-black/20 z-20 pointer-events-none" />
                        {/* button kiri */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition z-30"
                        >
                            <FaChevronLeft size={20} />
                        </button>
                        {/* button kanan */}
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition z-30"
                        >
                            <FaChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq">
                <div className="p-6 md:p-12">
                    <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
                        Formulir Saran & Pertanyaan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        {/* gambar */}
                        <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="relative w-full justify-center hidden md:flex"
                        >
                        <div className="w-full lg:w-8/12 space-y-4">
                            <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                            <motion.img
                                src={faq}
                                alt="Perjalanan Usaha"
                                className="w-full h-full"
                            />
                            </div>
                        </div>
                        </motion.div>
                        {/* teks */}
                        <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="w-full"
                        >
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                            <label className="block mb-1 font-medium">Nama</label>
                            <input
                                type="text"
                                name="nama_pelanggan"
                                placeholder="Masukkan nama Anda"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                                value={formData.nama_pelanggan}
                                onChange={(e) =>
                                    setFormData({ ...formData, nama_pelanggan: e.target.value })
                                }
                            />
                            </div>
                            <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Alamat email aktif"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                            </div>
                            <div>
                            <label className="block mb-1 font-medium">Saran / Pertanyaan</label>
                            <textarea
                                name="question"
                                rows="4"
                                placeholder="Tulis saran/pertanyaan Anda..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                required
                                value={formData.tanya}
                                onChange={(e) =>
                                    setFormData({ ...formData, tanya: e.target.value })
                                }
                            />
                            </div>
                            <div>
                                <button
                                type="submit"
                                className="w-full bg-primary text-white py-2 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition font-semibold"
                                >
                                Kirim
                                </button>
                            </div>
                        </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* lokasi */}
            <section id="lokasi">
                <div className="p-6 md:p-12">
                    <h2 className="text-3xl font-bold text-center mb-8">Lokasi Kami</h2>
                    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                        <iframe 
                            title="Lokasi TB. NOTO 19"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.4451270601567!2d110.8718013!3d-6.837115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70c57da4e416c1%3A0xb6db9dbfb8d027fb!2sTB%20.NOTO%2019!5e0!3m2!1sen!2sid!4v1744418031831!5m2!1sen!2sid"
                            width="100%" 
                            height="100%" 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>

            {/* trigger daftar */}
            <div className="mt-4 ml-12">
                <Link 
                to="/daftar"
                className="inline-block bg-primary text-white px-6 py-3 rounded-2xl shadow hover:bg-secondary/90 transition"
                >
                    Daftar Sekarang
                </Link>
            </div>
            <br />
        </div>
    );
};

export default Homepage;