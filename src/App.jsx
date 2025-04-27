import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Homepage from './pages/Homepage';

const AppContent = () => {
  const location = useLocation();
  const hideLayout = ['',].includes(location.pathname);

  return (
    <div className="overflow-x-hidden flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
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