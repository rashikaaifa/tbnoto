// src/pages/OrderPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { checkoutCart } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

export default function OrderPage() {
  const { state } = useLocation();
  const { token } = useAuth();

  // Ambil draft order dari navigate state atau localStorage
  const [order, setOrder] = useState(state?.order ?? null);

  // Form fields
  const [nama, setNama] = useState('');
  const [telp, setTelp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [metode, setMetode] = useState(''); // e.g. "cod" | "transfer_bank" | "ewallet"

  const [loading, setLoading] = useState(false);

  // Fallback saat refresh halaman
  useEffect(() => {
    if (!order) {
      const cached = localStorage.getItem('pendingOrder');
      if (cached) setOrder(JSON.parse(cached));
    }
  }, [order]);

  // Jika tetap tidak ada order
  if (!order) {
    return (
      <div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-600">Pesanan tidak ditemukan. Silakan kembali ke keranjang.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render ringkasan berdasarkan draft order
  const items = order.items || [];
  const subtotal =
    order.total_harga != null
      ? Number(order.total_harga)
      : items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty ?? it.quantity ?? 1), 0);

  const shipping =
    order.ongkir != null
      ? Number(order.ongkir)
      : Math.round(subtotal * 0.03);

  const total = (order.total != null ? Number(order.total) : (subtotal + shipping));

  // Kirim checkout ke backend dgn field sesuai DB
  const handlePlaceOrder = async () => {
    if (!nama || !telp || !alamat || !metode) {
      alert('Lengkapi Nama Penerima, Nomor Telepon, Alamat, dan Metode Pembayaran.');
      return;
    }

    // Siapkan items utk API (pakai cart item id & product id jika tersedia)
    const itemsForApi = items.map((it) => ({
      id: it.cartId,                 // optional
      cartId: it.cartId,             // optional
      productId: it.productId,       // optional (tergantung backend)
      quantity: it.qty ?? it.quantity ?? 1,
      price: Number(it.price || 0),
    }));

    setLoading(true);
    try {
      const res = await checkoutCart(itemsForApi, token, {
        nama_penerima: nama,
        no_telepon: telp,
        alamat_pengiriman: alamat,
        metode_pembayaran: metode,   // kirim huruf kecil: "cod" | "transfer_bank" | "ewallet"
        total_harga: subtotal,
        ongkir: shipping,
      });

      // Simpan hasil terakhir (opsional)
      localStorage.setItem('lastOrder', JSON.stringify(res));
      alert('Pesanan berhasil dibuat!');
      // TODO: jika ingin, redirect ke halaman riwayat/sukses
    } catch (e) {
      console.error(e);
      alert(e.message || 'Gagal menyelesaikan pesanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6">
        {/* Grid utama: kiri (form), kanan (ringkasan) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === KIRI: Alamat Pengiriman === */}
          <section className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Lengkap</label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Nomor Telepon</label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Masukkan nomor telepon"
                  value={telp}
                  onChange={(e) => setTelp(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Alamat Lengkap</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Masukkan alamat lengkap pengiriman"
                  rows={4}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Metode Pembayaran</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                >
                  <option value="">Pilih metode pembayaran</option>
                  <option value="transfer_bank">Transfer Bank</option>
                  <option value="cod">COD</option>
                  <option value="ewallet">E-Wallet</option>
                </select>
              </div>
            </div>
          </section>

          {/* === KANAN: Produk Dipesan === */}
          <aside className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-xl font-semibold mb-4">Produk Dipesan</h2>

            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.name || it.productName || 'Produk'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">IMG</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium line-clamp-1">
                        {it.name || it.productName || `Barang #${it.productId ?? ''}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {rupiah(it.price)} x {(it.qty ?? it.quantity ?? 1)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {rupiah((Number(it.price) || 0) * Number(it.qty ?? it.quantity ?? 1))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Subtotal Barang:</span>
                <span className="font-medium">{rupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Ongkir:</span>
                <span className="font-medium">{rupiah(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-green-800">{rupiah(total)}</span>
              </div>

              <button
                className="mt-4 w-full bg-green-800 hover:bg-green-900 text-white rounded-lg py-3 text-sm font-bold"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Selesaikan Pesanan'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
