import React, { useEffect, useState } from "react";
import { getRiwayatUser } from "../services/riwayatService";

export default function Riwayat() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRiwayat = async () => {
      setLoading(true);
      try {
        const data = await getRiwayatUser();
        setTransactions(data);
      } catch (err) {
        setError("Gagal mengambil data riwayat transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  return (
    <div className="min-h-screen flex flex-col mt-20">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-left">Riwayat Transaksi</h1>

        {loading && (
          <div className="text-center text-gray-600">Memuat data...</div>
        )}

        {error && (
          <div className="text-center text-red-600 mb-4">{error}</div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg font-medium mb-2">Belum ada pembelian.</p>
            <p className="mb-4">Ayo mulai belanja kebutuhan bangunanmu!</p>
            <a
              href="/katalog"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Belanja Sekarang
            </a>
          </div>
        )}

        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="border border-gray-300 bg-white p-4 rounded-lg mb-4 shadow hover:shadow-md transition"
          >
            <p className="font-semibold text-green-700 mb-1">{tx.date}</p>
            <p><span className="font-medium">Produk:</span> {tx.products}</p>
            <p><span className="font-medium">Jumlah:</span> {tx.quantity}</p>
            <p className="mt-2 text-sm text-gray-600">{tx.details}</p>

            {tx.proof && (
              <img
                src={tx.proof}
                alt="Bukti"
                className="w-32 h-32 object-cover rounded mt-3 border"
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer component tetap di bawah */}
      <footer className="mt-auto">
        {/* Tambahkan Footer jika ada */}
      </footer>
    </div>
  );
}
