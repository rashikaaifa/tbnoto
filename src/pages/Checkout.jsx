import React, { useState } from "react";
import { checkoutPenjualan } from "../services/checkoutService";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    const payload = {
      tgl_transaksi: new Date().toISOString().slice(0, 10),
      total_pemasukan: 150000,
      kontak_pelanggan: "08999999999",
      bukti_transaksi: null, // bisa URL jika upload bukti
      detail: [
        {
          barang_id: 1,
          kategori_id: 1,
          jumlah: 2,
          harga_satuan: 50000,
        },
        {
          barang_id: 2,
          kategori_id: 1,
          jumlah: 1,
          harga_satuan: 50000,
        },
      ],
    };

    try {
      const data = await checkoutPenjualan(payload);
      setSuccess(`Checkout berhasil! ID Transaksi: ${data.data.id}`);
    } catch (err) {
      setError(err.message || "Checkout gagal, periksa kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>
      {success && <p className="text-green-600 mt-4">{success}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
