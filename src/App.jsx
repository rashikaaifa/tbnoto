import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Homepage from './pages/Homepage';
import Footer from './components/footer/Footer';
import WhatsApp from './components/whatsapp/WhatsApp';
import Daftar from './pages/Daftar';
import Masuk from './pages/Masuk';
import Bantuan from './pages/Bantuan';
import Riwayat from './pages/Riwayat';
import Profil from './pages/Profil';
import Keranjang from './pages/Keranjang';
import ProductPage from './pages/ProductPage';
import ProductDetail from './pages/ProductDetail';
import OrderPage from './pages/OrderPage';

const AppContent = () => {
  const location = useLocation();
  const hideLayout = ['/daftar', '/masuk'].includes(location.pathname);

  return (
    <div className="overflow-x-hidden flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      {!hideLayout && <WhatsApp />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/daftar" element={<Daftar />} />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/bantuan" element={<Bantuan />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/keranjang" element={<Keranjang />} />
        <Route path="/katalog" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/orderPage" element={<OrderPage />} />
        <Route path="/katalog/kategori/:categorySlug" element={<ProductPage />} />

      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;