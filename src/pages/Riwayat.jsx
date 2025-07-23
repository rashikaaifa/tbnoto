
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
    <div className="max-w-2xl mx-auto p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>

      {loading && <p>Memuat data...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && transactions.length === 0 && <p>Belum ada transaksi.</p>}

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="border p-4 rounded mb-4 shadow hover:shadow-md transition"
        >
          <p className="font-semibold">{tx.date}</p>
          <p>Produk: {tx.products}</p>
          <p>Jumlah: {tx.quantity}</p>
          <p>{tx.details}</p>
          {tx.proof && (
            <img
              src={tx.proof}
              alt="Bukti"
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}
        </div>
      ))}
    </div>
  );
}

