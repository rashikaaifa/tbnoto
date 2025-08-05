import React, { useEffect, useState } from "react";
import { getRiwayatUser } from "../services/riwayatService";
import { Link } from "react-router-dom";

const RiwayatPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getRiwayatUser(token);

        if (Array.isArray(res)) {
          console.log("DATA API:", res);
          setTransactions(res);
        } else {
          setError("Data tidak sesuai format.");
        }
      } catch (err) {
        setError("Gagal mengambil data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  // Helper function untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      // Handle format dari API (biasanya YYYY-MM-DD HH:mm:ss)
      const date = new Date(dateString.replace(" ", "T"));
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return "-";
    }
  };

  // Helper function untuk format harga
  const formatPrice = (price) => {
    if (!price) return "-";
    return `Rp ${Number(price).toLocaleString("id-ID")}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen py-10 px-4 bg-white">
      <h2 className="text-2xl font-bold mb-6">Riwayat Transaksi</h2>

      {transactions.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Belum ada pembelian.
          </p>
          <p className="text-gray-500 mb-4">
            Ayo mulai belanja kebutuhan bangunanmu!
          </p>
          <Link
            to="/katalog"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md inline-block"
          >
            Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((trx) => (
            <div
              key={trx.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-gray-700">
                <span className="font-medium">Tanggal:</span>{" "}
                {formatDate(trx.created_at)}
              </p>

              <p className="text-gray-700">
                <span className="font-medium">Penerima:</span> {trx.nama_penerima || "-"}
              </p>
              
              <p className="text-gray-700">
                <span className="font-medium">Alamat:</span> {trx.alamat_pengiriman || "-"}
              </p>
              
              <p className="text-gray-700">
                <span className="font-medium">Telepon:</span> {trx.no_telepon || "-"}
              </p>
              
              <p className="text-gray-700">
                <span className="font-medium">Metode:</span> {trx.metode_pembayaran || "-"}
              </p>
              
              <p className="text-gray-700">
                <span className="font-medium">Status:</span> {trx.status_transactions || "-"}
              </p>
              
              <p className="text-gray-700">
                <span className="font-medium">Total Harga:</span>{" "}
                {formatPrice(trx.total_harga)}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiwayatPage;