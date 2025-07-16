import React, { useState, useEffect } from 'react';

export default function Riwayat() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Ambil data transaksi dan barang dari API
  useEffect(() => {
    async function fetchData() {
      try {
        const [penjualanRes, barangRes] = await Promise.all([
          fetch("https://tbnoto19-admin.rplrus.com/api/penjualan"),
          fetch("https://tbnoto19-admin.rplrus.com/api/barang"),
        ]);

        const penjualanData = await penjualanRes.json();
        const barangData = await barangRes.json();

        const barangMap = {};
        barangData.forEach((barang) => {
          barangMap[barang.id] = barang.nama_barang; // Ubah jika field-nya beda
        });

        const mappedTransactions = penjualanData.map((tx) => ({
          id: tx.id,
          date: new Date(tx.tgl_transaksi).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          product: barangMap[tx.barang_id] || `ID Barang: ${tx.barang_id}`,
          quantity: tx.jumlah_terjual,
          proof: `https://tbnoto19-admin.rplrus.com/storage/${tx.bukti_transaksi}`,
          details: `Total: Rp ${Number(tx.total_pemasukan).toLocaleString("id-ID")}`,
        }));

        setTransactions(mappedTransactions);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", showDetail);
  }, [showDetail]);

  const openDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setSelectedTransaction(null);
    setShowDetail(false);
  };

  return (
    <div className="mt-12 px-4 max-w-full overflow-x-hidden">
      <h1 className="text-2xl md:text-3xl font-bold lg:text-4xl mt-16 mb-6 px-4 sm:px-8 lg:px-20 text-left">
        Riwayat Transaksi
      </h1>

      {!isMobile ? (
        <div className="overflow-x-auto mx-20 mb-20">
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
              {transactions.map((transaction, index) => (
                <tr key={transaction.id} className="text-center border-t">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{transaction.date}</td>
                  <td className="p-2">{transaction.product}</td>
                  <td className="p-2">{transaction.quantity}</td>
                  <td className="p-2">
                    <div className="flex justify-center">
                      <img
                        src={transaction.proof}
                        alt="Bukti"
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => openDetail(transaction)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4 px-4">
          {transactions.map((tx, index) => (
            <div key={tx.id} className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex justify-between text-sm mb-1">
                <span>No:</span>
                <span>{index + 1}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tanggal:</span>
                <span>{tx.date}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Produk:</span>
                <span>{tx.product}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span>Jumlah:</span>
                <span>{tx.quantity}</span>
              </div>
              <button
                onClick={() => openDetail(tx)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Detail
              </button>
            </div>
          ))}
        </div>
      )}

      {showDetail && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detail Transaksi</h2>
              <button onClick={closeDetail} className="text-3xl leading-none">
                &times;
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <p>No. Transaksi</p>
                <p>{selectedTransaction.id}</p>
              </div>
              <div className="flex justify-between">
                <p>Tanggal</p>
                <p>{selectedTransaction.date}</p>
              </div>
              <div className="flex justify-between">
                <p>Produk</p>
                <p>{selectedTransaction.product}</p>
              </div>
              <div className="flex justify-between">
                <p>Jumlah</p>
                <p>{selectedTransaction.quantity}</p>
              </div>
              <div>
                <p className="mb-1">Bukti Transaksi</p>
                <img
                  src={selectedTransaction.proof}
                  alt="Bukti"
                  className="w-full max-w-[200px] max-h-[250px] object-contain mx-auto rounded"
                />
              </div>
              <div>
                <p className="mb-1">Detail</p>
                <p>{selectedTransaction.details}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
