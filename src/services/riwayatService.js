const BASE_URL = "https://tbnoto19-admin.rplrus.com/api";

export async function getRiwayatUser() {
  const token = localStorage.getItem("token"); // pastikan token login user sudah disimpan
  try {
    const res = await fetch(`${BASE_URL}/penjualan/riwayat-transaksi`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();

    return data.map((tx) => ({
      id: tx.id,
      date: new Date(tx.tgl_transaksi).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      products: tx.detail.map((d) => d.barang.nama_barang).join(", "),
      quantity: tx.detail.reduce((sum, d) => sum + d.jumlah, 0),
      proof: tx.bukti_transaksi
        ? `https://tbnoto19-admin.rplrus.com/storage/${tx.bukti_transaksi}`
        : "https://via.placeholder.com/150",
      details: `Total: Rp ${Number(tx.total_pemasukan).toLocaleString("id-ID")}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil riwayat:", error);
    throw error;
  }
}
