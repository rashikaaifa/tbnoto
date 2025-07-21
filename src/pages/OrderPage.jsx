import React, { useState, useEffect } from 'react';

// Simulasi orderService.js yang akan menggunakan API yang sama
const API_BASE_URL = 'https://tbnoto19-admin.rplrus.com/api';

// Fungsi untuk format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const OrderPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [customerData, setCustomerData] = useState({
    nama: '',
    telepon: '',
    alamat: ''
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulasi data keranjang (dalam implementasi nyata akan dari context/state management)
  // Data ini akan mengikuti format API yang sama dengan productService
  const cartItems = [
    {
      id: 1,
      nama_barang: 'Paralon PVC 4 meter',
      kategori_id: 1,
      harga: 25000,
      quantity: 6,
      foto_barang: 'storage/barang/paralon.jpg',
      stok: 50,
      deskripsi: 'Paralon PVC berkualitas tinggi'
    },
    {
      id: 2,
      nama_barang: 'Triplek 18mm',
      kategori_id: 2,
      harga: 35000,
      quantity: 3,
      foto_barang: 'storage/barang/triplek.jpg',
      stok: 25,
      deskripsi: 'Triplek kayu berkualitas'
    },
    {
      id: 3,
      nama_barang: 'Besi Beton 5 meter',
      kategori_id: 3,
      harga: 45000,
      quantity: 10,
      foto_barang: 'storage/barang/besi.jpg',
      stok: 100,
      deskripsi: 'Besi beton untuk konstruksi'
    },
    {
      id: 4,
      nama_barang: 'Kayu Meranti per ikat',
      kategori_id: 4,
      harga: 50000,
      quantity: 3,
      foto_barang: 'storage/barang/kayu.jpg',
      stok: 15,
      deskripsi: 'Kayu meranti pilihan'
    }
  ];

  const paymentMethods = [
    { id: 'transfer_bank', name: 'Transfer Bank' },
    { id: 'cod', name: 'Cash on Delivery (COD)' },
    { id: 'gopay', name: 'GoPay' },
    { id: 'ovo', name: 'OVO' },
    { id: 'dana', name: 'DANA' },
    { id: 'shopee_pay', name: 'ShopeePay' }
  ];

  // Fungsi untuk format gambar sesuai dengan productService
  const formatImageUrl = (fotoBarang) => {
    if (!fotoBarang) return '/api/placeholder/80/80';
    return `${API_BASE_URL.replace('/api', '')}/storage/${fotoBarang.replace(/^storage\//, '')}`;
  };

  // Perhitungan harga
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.harga) * item.quantity), 0);
  const ongkir = 15000;
  const total = subtotal + ongkir;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmitOrder = async () => {
    // Validasi form
    if (!customerData.nama || !customerData.telepon || !customerData.alamat || !selectedPaymentMethod) {
      alert('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    // Struktur data pesanan yang akan dikirim ke API
    const orderData = {
      customer_name: customerData.nama,
      customer_phone: customerData.telepon,
      customer_address: customerData.alamat,
      payment_method: selectedPaymentMethod,
      items: cartItems.map(item => ({
        barang_id: item.id,
        quantity: item.quantity,
        price: item.harga
      })),
      subtotal: subtotal,
      ongkir: ongkir,
      total: total,
      status: 'pending'
    };

    try {
      // Di sini akan ada call ke API untuk submit pesanan
      console.log('Order data:', orderData);
      alert('Pesanan berhasil dibuat!');
      
      // Reset form atau redirect ke halaman konfirmasi
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    }
  };

  return (
    <div className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className={`${isMobile ? 'mb-3' : 'mb-6'}`}>
        <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} md:text-3xl lg:text-4xl`}>
          Pembayaran
        </h1>
        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-gray-600 mt-1`}>
          Konfirmasi pesanan dan pembayaran Anda
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Shipping Info & Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-4`}>
              Alamat Pengiriman
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-700 mb-2`}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  value={customerData.nama}
                  onChange={handleInputChange}
                  className={`w-full ${isMobile ? 'py-2 text-sm' : 'py-3'} px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div>
                <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-700 mb-2`}>
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="telepon"
                  value={customerData.telepon}
                  onChange={handleInputChange}
                  className={`w-full ${isMobile ? 'py-2 text-sm' : 'py-3'} px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Masukkan nomor telepon"
                  required
                />
              </div>
              <div>
                <label className={`block ${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-700 mb-2`}>
                  Alamat Lengkap
                </label>
                <textarea
                  name="alamat"
                  rows="4"
                  value={customerData.alamat}
                  onChange={handleInputChange}
                  className={`w-full ${isMobile ? 'py-2 text-sm' : 'py-3'} px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
                  placeholder="Masukkan alamat lengkap pengiriman"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-4`}>
              Metode Pembayaran
            </h2>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className={`w-full ${isMobile ? 'py-2 text-sm' : 'py-3'} px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white`}
              required
            >
              <option value="">Pilih metode pembayaran</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-4`}>
              Produk Dipesan
            </h2>
            
            {/* Product List */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                    <img 
                      src={formatImageUrl(item.foto_barang)} 
                      alt={item.nama_barang}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/80/80';
                      }}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'} text-gray-900 truncate`}>
                      {item.nama_barang}
                    </h3>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 flex justify-between items-center mt-1`}>
                      <span>{formatCurrency(parseFloat(item.harga))}</span>
                      <span>x {item.quantity}</span>
                    </div>
                  </div>
                  <div className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>
                    {formatCurrency(parseFloat(item.harga) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className={`flex justify-between ${isMobile ? 'text-sm' : 'text-base'}`}>
                <span>Subtotal Barang:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className={`flex justify-between ${isMobile ? 'text-sm' : 'text-base'}`}>
                <span>Ongkir:</span>
                <span>{formatCurrency(ongkir)}</span>
              </div>
              <div className={`flex justify-between font-bold ${isMobile ? 'text-base' : 'text-lg'} text-gray-900 pt-2 border-t`}>
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Order Button */}
            <button 
              onClick={handleSubmitOrder}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium ${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} rounded-lg mt-6 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={!customerData.nama || !customerData.telepon || !customerData.alamat || !selectedPaymentMethod}
            >
              Selesaikan Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;