import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Homepage from './pages/Homepage';
import Footer from './components/footer/Footer';
import WhatsApp from './components/whatsapp/WhatsApp';
import Daftar from './pages/Daftar';

const AppContent = () => {
  const location = useLocation();
  const hideLayout = ['/daftar',].includes(location.pathname);

  return (
    <div className="overflow-x-hidden flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      {!hideLayout && <WhatsApp />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/daftar" element={<Daftar />} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;