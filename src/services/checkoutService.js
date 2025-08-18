const BASE_URL = 'https://tbnoto19-admin.rplrus.com/api';

export async function checkoutPenjualan(payload) {
	const token = localStorage.getItem('token');

	try {
		const res = await fetch(`${BASE_URL}/cart/checkout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.message || 'Gagal checkout.');
		}

		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Checkout error:', error);
		throw error;
	}
}
