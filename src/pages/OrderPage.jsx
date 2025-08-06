// src/pages/OrderPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkoutCart } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

export default function OrderPage() {
  const { state } = useLocation();
  const { token, user } = useAuth(); // Ambil user dari AuthContext

  // Ambil draft order dari navigate state atau localStorage
  const [order, setOrder] = useState(state?.order ?? null);

  // Form fields - akan diisi otomatis dari data user
  const [nama, setNama] = useState('');
  const [telp, setTelp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [metode, setMetode] = useState(''); // e.g. "cod" | "transfer_bri" | "transfer_bca"
  const [buktiTransfer, setBuktiTransfer] = useState(null); // File bukti transfer
  const [previewImage, setPreviewImage] = useState(null); // Preview gambar
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-fill form berdasarkan data user
  useEffect(() => {
    if (user) {
      // Auto-fill nama dari field 'name'
      if (user.name) {
        setNama(user.name);
      }
      
      // Auto-fill nomor telepon dari field 'phone'
      if (user.phone) {
        setTelp(user.phone);
      }
      
      // Auto-fill alamat dari field 'address'
      if (user.address) {
        setAlamat(user.address);
      }
    }
  }, [user]);

  // Fallback saat refresh halaman
  useEffect(() => {
    if (!order) {
      const cached = localStorage.getItem('pendingOrder');
      if (cached) setOrder(JSON.parse(cached));
    }
  }, [order]);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar (JPG, PNG, etc.)');
        return;
      }
      
      // Validasi ukuran file (maksimal 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      setBuktiTransfer(file);
      
      // Buat preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset file when payment method changes
  useEffect(() => {
    if (metode !== 'transfer_bri' && metode !== 'transfer_bca') {
      setBuktiTransfer(null);
      setPreviewImage(null);
    }
  }, [metode]);

  // Jika tetap tidak ada order
  if (!order) {
    return (
      <div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
          <div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-lg shadow-sm my-4">
            <div className="text-4xl text-gray-400 mb-3">📋</div>
            <p className="text-sm font-medium text-gray-500 mb-4">
              Pesanan tidak ditemukan. Silakan kembali ke keranjang.
            </p>
            <button
              onClick={() => navigate('/keranjang')}
              className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors"
            >
              Kembali ke Keranjang
            </button>
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

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pesanan Berhasil Dibuat!</h3>
        <p className="text-sm text-gray-600 mb-6">
          Terima kasih telah berbelanja. Pesanan Anda sedang diproses dan akan segera dikirim.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/keranjang');
            }}
            className="flex-1 bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Kembali ke Keranjang
          </button>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/katalog');
            }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Lanjut Belanja
          </button>
        </div>
      </div>
    </div>
  );

  // Kirim checkout ke backend dgn field sesuai DB
  const handlePlaceOrder = async () => {
    if (!nama || !telp || !alamat || !metode) {
      alert('Lengkapi Nama Penerima, Nomor Telepon, Alamat, dan Metode Pembayaran.');
      return;
    }

    // Validasi bukti transfer untuk metode transfer bank
    if ((metode === 'transfer_bri' || metode === 'transfer_bca') && !buktiTransfer) {
      alert('Silakan upload bukti transfer untuk metode pembayaran transfer bank.');
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
      // Untuk metode transfer, gunakan FormData untuk kirim file
      let requestData;
      let isFormData = false;

      if ((metode === 'transfer_bri' || metode === 'transfer_bca') && buktiTransfer) {
        // Gunakan FormData untuk upload file
        requestData = new FormData();
        requestData.append('nama_penerima', nama);
        requestData.append('no_telepon', telp);
        requestData.append('alamat_pengiriman', alamat);
        requestData.append('metode_pembayaran', metode);
        requestData.append('total_harga', subtotal);
        requestData.append('ongkir', shipping);
        requestData.append('bukti_transfer', buktiTransfer);
        requestData.append('items', JSON.stringify(itemsForApi));
        isFormData = true;
      } else {
        // Gunakan JSON untuk COD atau metode lain
        requestData = {
          nama_penerima: nama,
          no_telepon: telp,
          alamat_pengiriman: alamat,
          metode_pembayaran: metode,
          total_harga: subtotal,
          ongkir: shipping,
          items: itemsForApi,
        };
      }

      const res = await checkoutCart(itemsForApi, token, {
        nama_penerima: nama,
        no_telepon: telp,
        alamat_pengiriman: alamat,
        metode_pembayaran: metode,
        total_harga: subtotal,
        ongkir: shipping,
        bukti_transfer: buktiTransfer, // Pass file to service
        isFormData: isFormData, // Flag for service to handle FormData
      });

      // Simpan hasil terakhir (opsional)
      localStorage.setItem('lastOrder', JSON.stringify(res));
      setShowSuccessModal(true);

    } catch (e) {
      console.error(e);
      alert(e.message || 'Gagal menyelesaikan pesanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['Poppins'] bg-gray-50 text-gray-800 leading-relaxed pt-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-12">
        {/* Header */}
        <header className="mb-3 sm:mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-0 md:text-2xl lg:text-3xl">
            Checkout Pesanan
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 sm:text-sm">
            Lengkapi data pengiriman untuk menyelesaikan pesanan Anda
          </p>
        </header>

        {/* Grid utama: kiri (form), kanan (ringkasan) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
          {/* === KIRI: Alamat Pengiriman === */}
          <section className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Alamat Pengiriman</h2>

            {/* Tampilkan info jika data diambil dari profil */}
            {user && (nama || telp || alamat) && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Data diambil dari profil Anda</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Anda dapat mengubah data di bawah ini jika diperlukan
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                  placeholder="Contoh: +62812345678 atau 081234567890"
                  value={telp}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Hanya izinkan angka dan tanda + di awal
                    const filteredValue = value.replace(/[^0-9+]/g, '');
                    
                    // Jika ada tanda +, pastikan hanya di awal dan diikuti angka
                    if (filteredValue.includes('+')) {
                      const parts = filteredValue.split('+');
                      if (parts.length > 2) {
                        // Jika ada lebih dari satu +, ambil hanya yang pertama
                        setTelp('+' + parts[1].replace(/[^0-9]/g, ''));
                      } else if (filteredValue.startsWith('+')) {
                        setTelp(filteredValue);
                      } else {
                        // Jika + tidak di awal, hilangkan
                        setTelp(filteredValue.replace(/\+/g, ''));
                      }
                    } else {
                      setTelp(filteredValue);
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const filteredValue = pastedText.replace(/[^0-9+]/g, '');
                    
                    if (filteredValue.includes('+')) {
                      const parts = filteredValue.split('+');
                      if (parts.length > 2) {
                        setTelp('+' + parts[1].replace(/[^0-9]/g, ''));
                      } else if (filteredValue.startsWith('+')) {
                        setTelp(filteredValue);
                      } else {
                        setTelp(filteredValue.replace(/\+/g, ''));
                      }
                    } else {
                      setTelp(filteredValue);
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 resize-none"
                  placeholder="Masukkan alamat lengkap pengiriman"
                  rows={4}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metode Pembayaran <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                >
                  <option value="">Pilih metode pembayaran</option>
                  <option value="cod">COD (Cash on Delivery)</option>
                  <option value="transfer_bri">Transfer Bank BRI</option>
                  <option value="transfer_bca">Transfer Bank BCA</option>
                </select>

                {/* Tampilkan nomor rekening jika pilih transfer bank */}
                {(metode === 'transfer_bri' || metode === 'transfer_bca') && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                          Informasi Rekening {metode === 'transfer_bri' ? 'BRI' : 'BCA'}
                        </p>
                        
                        {metode === 'transfer_bri' && (
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded border">
                              <div className="text-xs text-gray-600 mb-1">Bank BRI</div>
                              <div className="font-mono text-sm font-semibold text-gray-900">1234-5678-9012-3456</div>
                              <div className="text-xs text-gray-600 mt-1">a.n. Toko Online</div>
                            </div>
                            <p className="text-xs text-blue-600">
                              • Transfer sesuai total pembayaran<br/>
                              • Simpan bukti transfer<br/>
                              • Pesanan akan diproses setelah pembayaran dikonfirmasi
                            </p>
                          </div>
                        )}

                        {metode === 'transfer_bca' && (
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded border">
                              <div className="text-xs text-gray-600 mb-1">Bank BCA</div>
                              <div className="font-mono text-sm font-semibold text-gray-900">9876-5432-1098-7654</div>
                              <div className="text-xs text-gray-600 mt-1">a.n. Toko Online</div>
                            </div>
                            <p className="text-xs text-blue-600">
                              • Transfer sesuai total pembayaran<br/>
                              • Simpan bukti transfer<br/>
                              • Pesanan akan diproses setelah pembayaran dikonfirmasi
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Field Upload Bukti Transfer */}
                {(metode === 'transfer_bri' || metode === 'transfer_bca') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Bukti Transfer <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="space-y-3">
                      {/* File Input */}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (Maksimal 5MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>

                      {/* Preview Image */}
                      {previewImage && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview Bukti Transfer:</p>
                          <div className="relative inline-block">
                            <img
                              src={previewImage}
                              alt="Preview bukti transfer"
                              className="max-w-full h-40 object-contain rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setBuktiTransfer(null);
                                setPreviewImage(null);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            File: {buktiTransfer?.name} ({(buktiTransfer?.size / 1024).toFixed(1)} KB)
                          </p>
                        </div>
                      )}

                      {/* Upload Tips */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Tips Upload Bukti Transfer:</p>
                            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                              <li>• Pastikan gambar jelas dan tidak blur</li>
                              <li>• Terlihat nominal transfer yang sesuai</li>
                              <li>• Terlihat tanggal dan waktu transfer</li>
                              <li>• Format file: JPG, PNG, atau JPEG</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* === KANAN: Produk Dipesan === */}
          <aside className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Ringkasan Pesanan</h2>

            <div className="space-y-3 mb-4">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {it.name || it.productName || `Barang #${it.productId ?? ''}`}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        {rupiah(it.price)} × {(it.qty ?? it.quantity ?? 1)}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {rupiah((Number(it.price) || 0) * Number(it.qty ?? it.quantity ?? 1))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal Barang:</span>
                <span className="font-medium text-gray-900">{rupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ongkos Kirim:</span>
                <span className="font-medium text-gray-900">{rupiah(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total Pembayaran:</span>
                <span className="text-green-800">{rupiah(total)}</span>
              </div>

              <button
                className="mt-4 w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md py-3 text-sm font-semibold transition-colors"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  'Selesaikan Pesanan'
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
}