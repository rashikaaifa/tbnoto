const BASE_URL = 'https://tbnoto19-admin.rplrus.com/api';

export async function getRiwayatUser() {
	const token = localStorage.getItem('token');

	try {
		const res = await fetch(`${BASE_URL}/cart/riwayat-transaksi`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		});

		if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

		const json = await res.json();

		console.log('📦 Data dari API:', json);

		// ✅ Periksa kalau langsung array
		if (!Array.isArray(json)) {
			console.error('⚠️ Format data API tidak sesuai:', json);
			return [];
		}

		// ✅ Kembalikan data asli dari API tanpa formatting berlebihan
		// Biarkan component yang handle formatting tampilan
		return json;
	} catch (error) {
		console.error('❌ Gagal mengambil riwayat:', error);
		return [];
	}
}
