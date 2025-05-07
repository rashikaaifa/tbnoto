import React, { useState, useEffect } from 'react';

import bukti1 from "../assets/img/bukti.png";
import bukti2 from "../assets/img/genjiii.jpg";
import bukti3 from "../assets/img/jekii.jpg";
import bukti4 from "../assets/img/lcu.jpg";
import bukti5 from "../assets/img/mett.jpg";
import bukti6 from "../assets/img/pillows.jpg";

export default function TransactionTableUnified() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const transactions = [
    { id: 1, date: '5 Januari 2025', product: 'Kaso', quantity: 3, proof: bukti1, details: 'Pembelian kaso ukuran 4x6 cm panjang 4 meter' },
    { id: 2, date: '30 April 2025', product: 'Besi', quantity: 16, proof: bukti2, details: 'Pembelian besi beton 10mm' },
    { id: 3, date: '18 September 2025', product: 'Paku', quantity: 1000, proof: bukti3, details: 'Pembelian paku ukuran 2 inci' },
    { id: 4, date: '6 Desember 2025', product: 'Triplek', quantity: 20, proof: bukti4, details: 'Pembelian triplek 12mm' },
    { id: 5, date: '12 Februari 2025', product: 'Semen', quantity: 7, proof: bukti5, details: 'Pembelian semen 50kg per sak' },
    { id: 6, date: '11 Juli 2025', product: 'Paralon', quantity: 3, proof: bukti6, details: 'Pembelian paralon 4 inci panjang 4 meter' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showDetail) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showDetail]);

  const openDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="mt-20 px-4 max-w-full overflow-x-hidden">
      <h1 className="text-2xl text-center mb-4 font-semibold">Riwayat Transaksi</h1>

      {!isMobile ? (
        <div className="overflow-x-auto mx-20">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-3 border">No.</th>
                <th className="p-3 border">Tanggal Transaksi</th>
                <th className="p-3 border">Nama Produk</th>
                <th className="p-3 border">Jumlah</th>
                <th className="p-3 border">Bukti Transaksi</th>
                <th className="p-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="text-center border-t">
                  <td className="p-2">{transaction.id}</td>
                  <td className="p-2">{transaction.date}</td>
                  <td className="p-2">{transaction.product}</td>
                  <td className="p-2">{transaction.quantity}</td>
                  <td className="p-2">
                    <img src={transaction.proof} alt="Bukti" className="w-24 rounded" />
                  </td>
                  <td className="p-2">
                    <button onClick={() => openDetail(transaction)} className="bg-blue-600 text-white py-2 px-4 rounded-xs hover:bg-blue-700">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4 px-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex justify-between text-sm mb-1"><span>ID Transaksi:</span><span>{tx.id}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Tanggal:</span><span>{tx.date}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Produk:</span><span>{tx.product}</span></div>
              <div className="flex justify-between text-sm mb-3"><span>Jumlah:</span><span>{tx.quantity}</span></div>
              <button onClick={() => openDetail(tx)} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Detail</button>
            </div>
          ))}
        </div>
      )}

      {showDetail && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detail Transaksi</h2>
              <button onClick={closeDetail} className="text-3xl leading-none">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><p>No. Transaksi</p><p>{selectedTransaction.id}</p></div>
              <div className="flex justify-between"><p>Tanggal</p><p>{selectedTransaction.date}</p></div>
              <div className="flex justify-between"><p>Produk</p><p>{selectedTransaction.product}</p></div>
              <div className="flex justify-between"><p>Jumlah</p><p>{selectedTransaction.quantity}</p></div>
              <div>
                <p className="mb-1">Bukti Transaksi</p>
                <img src={selectedTransaction.proof} alt="Bukti" className="w-full max-w-[200px] mx-auto rounded" />
              </div>
              <div><p className="mb-1">Detail</p><p>{selectedTransaction.details}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

