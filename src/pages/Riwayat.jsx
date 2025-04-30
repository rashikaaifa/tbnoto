import React, { useState, useEffect } from 'react';
import "../style/RiwayatStyle.css";

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
    { id: 2, date: '30 Februari 2025', product: 'Besi', quantity: 16, proof: bukti2, details: 'Pembelian besi beton 10mm' },
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

  const openDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="transaction-container container mx-auto p-4">
      <h1 className="transaction-header text-2xl mb-4">Riwayat Transaksi</h1>

      {!isMobile ? (
        <div className="table-wrapper">
          <table className="transaction-table w-full">
            <thead>
              <tr className="table-header">
                <th>No.</th>
                <th>Tanggal Transaksi</th>
                <th>Nama Produk</th>
                <th>Jumlah</th>
                <th>Bukti Transaksi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="table-row">
                  <td>{transaction.id}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.product}</td>
                  <td>{transaction.quantity}</td>
                  <td><img src={transaction.proof} alt="Bukti" className="proof-image" /></td>
                  <td>
                    <button className="detail-button" onClick={() => openDetail(transaction)}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mobile-cards">
          {transactions.map((tx) => (
            <div key={tx.id} className="transaction-card">
              <div className="transaction-info"><span>ID Transaksi:</span><span>{tx.id}</span></div>
              <div className="transaction-info"><span>Tanggal:</span><span>{tx.date}</span></div>
              <div className="transaction-info"><span>Produk:</span><span>{tx.product}</span></div>
              <div className="transaction-info"><span>Jumlah:</span><span>{tx.quantity}</span></div>
              <div className="transaction-info">
                {/* <span>Bukti:</span>
                <img src={tx.proof} alt="Bukti" className="proof-image" /> */}
              </div>
              <button className="detail-button full-width" onClick={() => openDetail(tx)}>Detail</button>
            </div>
          ))}
        </div>
      )}

{showDetail && selectedTransaction && (
  <div className="modal-backdrop">
  <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Detail Transaksi</h2>
        <button onClick={closeDetail} className="close-button">&times;</button>
      </div>
      <div className="modal-body">
        <div className="detail-group"><p>No. Transaksi</p><p>{selectedTransaction.id}</p></div>
        <div className="detail-group"><p>Tanggal</p><p>{selectedTransaction.date}</p></div>
        <div className="detail-group"><p>Produk</p><p>{selectedTransaction.product}</p></div>
        <div className="detail-group"><p>Jumlah</p><p>{selectedTransaction.quantity}</p></div>
        <div className="detail-group"><p>Bukti Transaksi</p><img src={selectedTransaction.proof} alt="Bukti" className="proof-image" /></div>
        <div className="detail-group"><p>Detail</p><p>{selectedTransaction.details}</p></div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}