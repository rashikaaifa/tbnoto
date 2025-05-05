// Simulasi API service untuk mengambil data produk
// Pada implementasi sebenarnya, ini akan memanggil API backend

export const getProducts = async () => {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Data produk simulasi
    return [
      {
        id: 1,
        nama: 'Triplek',
        kategori: 'triplek',
        ukuran: '3 meter x 60 cm',
        harga: 50000,
        satuan: 'lembar',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 24
      },
      {
        id: 2,
        nama: 'Triplek',
        kategori: 'triplek',
        ukuran: '4 meter x 80 cm',
        harga: 75000,
        satuan: 'lembar',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 15
      },
      {
        id: 3,
        nama: 'Kayu',
        kategori: 'kayu',
        ukuran: '4 cm x 6 cm x 4 meter',
        harga: 45000,
        satuan: 'batang',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 32
      },
      {
        id: 4,
        nama: 'Kayu',
        kategori: 'kayu',
        ukuran: '6 cm x 12 cm x 4 meter',
        harga: 85000,
        satuan: 'batang',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 18
      },
      {
        id: 5,
        nama: 'Besi',
        kategori: 'besi',
        ukuran: '10 mm',
        harga: 35000,
        satuan: 'batang',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 40
      },
      {
        id: 6,
        nama: 'Besi',
        kategori: 'besi',
        ukuran: '12 mm',
        harga: 50000,
        satuan: 'batang',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 25
      },
      {
        id: 7,
        nama: 'Paralon',
        kategori: 'paralon',
        ukuran: '1 inch',
        harga: 30000,
        satuan: 'meter',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 50
      },
      {
        id: 8,
        nama: 'Paralon',
        kategori: 'paralon',
        ukuran: '3 inch',
        harga: 55000,
        satuan: 'meter',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 30
      },
      {
        id: 9,
        nama: 'Paralon',
        kategori: 'paralon',
        ukuran: '4 inch',
        harga: 65000,
        satuan: 'meter',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 20
      },
      {
        id: 10,
        nama: 'Triplek',
        kategori: 'triplek',
        ukuran: '2 meter x 40 cm',
        harga: 40000,
        satuan: 'lembar',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 35
      },
      {
        id: 11,
        nama: 'Kayu',
        kategori: 'kayu',
        ukuran: '5 cm x 10 cm x 3 meter',
        harga: 55000,
        satuan: 'batang',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 22
      },
      {
        id: 12,
        nama: 'Besi',
        kategori: 'besi',
        ukuran: '8 mm',
        harga: 30000,
        satuan: 'batang',
        gambar: 'https://i1.wp.com/besemahpustaka.com/wp-content/uploads/2020/05/triplek.jpg?fit=770%2C482&ssl=1',
        stok: 45
      }
    ];
  };
  
  export const getProductById = async (id) => {
    const products = await getProducts();
    return products.find(product => product.id === id) || null;
  };
  