// src/services/productService.js
// ======================================================================
// - Retry 429 (hormati Retry-After) + backoff
// - TTL cache + de-dup untuk GET /barang & /kategori
// - CART formatter robust
// - Debounce/buffer untuk update qty keranjang & penyesuaian stok
// - setProductStockSmart: PATCH payload lengkap (tanpa foto) → PUT fallback
// ======================================================================

const API_BASE = 'https://tbnoto19-admin.rplrus.com/api';
const API_URL = `${API_BASE}/barang`;
const CATEGORY_API_URL = `${API_BASE}/kategori`;
const CART_API_URL = `${API_BASE}/cart`;

const DEBUG = false; // set true jika mau melihat log debug di console

// -------------------- util fetch --------------------
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, options = {}, { retries = 3, baseDelay = 500 } = {}) {
  let attempt = 0;
  const opts = { cache: 'no-store', ...options };
  while (true) {
    const res = await fetch(url, opts);
    if (res.status !== 429) return res;
    if (attempt >= retries) return res;

    const ra = res.headers.get('Retry-After');
    const delay = ra ? parseFloat(ra) * 1000 : baseDelay * Math.pow(2, attempt);
    if (DEBUG) console.warn(`[429] ${url} → retry in ${delay}ms (attempt ${attempt + 1}/${retries})`);
    await sleep(delay);
    attempt++;
  }
}

// -------------------- de-dup + TTL cache untuk GET --------------------
const CACHE_TTL = 120 * 1000; // 120 detik untuk kurangi 429 di katalog
let productsCache = { data: null, ts: 0 };
let categoriesCache = { data: null, ts: 0 };
const inflight = new Map(); // key -> Promise<Response>

function keyFor(url, method = 'GET') {
  return `${method.toUpperCase()} ${url}`;
}

async function getWithCache(url, { ttl = CACHE_TTL } = {}) {
  const now = Date.now();

  if (url === API_URL && productsCache.data && (now - productsCache.ts) < ttl) return productsCache.data;
  if (url === CATEGORY_API_URL && categoriesCache.data && (now - categoriesCache.ts) < ttl) return categoriesCache.data;

  const k = keyFor(url, 'GET');
  if (inflight.has(k)) {
    const res = await inflight.get(k);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.clone().json();
  }

  const req = fetchWithRetry(url, { method: 'GET' }, { retries: 3, baseDelay: 500 });
  inflight.set(k, req);
  try {
    const res = await req;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (url === API_URL) productsCache = { data, ts: now };
    if (url === CATEGORY_API_URL) categoriesCache = { data, ts: now };
    return data;
  } finally {
    inflight.delete(k);
  }
}

export const invalidateProductsCache = () => { productsCache = { data: null, ts: 0 }; };
export const invalidateCategoriesCache = () => { categoriesCache = { data: null, ts: 0 }; };

// -------------------- formatter produk/keranjang --------------------
const formatProductData = (p) => {
  const foto = (p?.foto_barang || '').replace(/^storage\//, '');
  return {
    id: p.id,
    nama: p.nama_barang,
    kategori: p.kategori_id ? String(p.kategori_id) : '',
    harga: Number(p.harga ?? 0),
    stok: Number(p.stok ?? 0),
    deskripsi: p.deskripsi || '',
    gambar: foto ? `https://tbnoto19-admin.rplrus.com/storage/${foto}` : '/placeholder-image.jpg',
    ukuran: p.ukuran || '',
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
};

const formatCartData = (c) => {
  if (!c) return null;
  const b = c.barang || c.product || {};
  const rawQty = c.quantity ?? c.qty ?? c.jumlah ?? 0;
  const rawName  = c.nama_barang || b.nama_barang || b.name || `Produk ID ${c.barang_id || b.id || 'unknown'}`;
  const rawPrice = c.harga_satuan ?? b.harga ?? b.price ?? 0;
  const rawStock = b.stok ?? b.stock ?? 0;

  let foto = c.foto_barang || b.foto_barang || b.image || '';
  if (typeof foto === 'string') foto = foto.replace(/^storage\//, '');
  const imageUrl = foto ? `https://tbnoto19-admin.rplrus.com/storage/${foto}` : '/placeholder-image.jpg';

  const cartId = c.id ?? c.cart_id ?? c.pivot?.id ?? null;
  const prodId = c.barang_id ?? b.id ?? c.product_id ?? null;

  return {
    id: cartId,
    productId: prodId,
    name: rawName,
    image: imageUrl,
    price: Number(rawPrice),
    size: c.ukuran || b.ukuran || b.size || '',
    stock: Number(rawStock),
    quantity: Number(rawStock), // fallback utk komponen lama
    cartQuantity: Number(rawQty),
    totalPrice: Number(c.total_harga ?? (rawPrice * rawQty)),
  };
};

// -------------------- Produk API --------------------
export const getProducts = async () => {
  try {
    const data = await getWithCache(API_URL, { ttl: CACHE_TTL });
    if (!Array.isArray(data)) throw new Error('Format produk tidak valid');
    return data.map(formatProductData);
  } catch {
    throw new Error('Gagal mengambil data produk');
  }
};

export const getProductById = async (id) => {
  const res = await fetchWithRetry(`${API_URL}/${id}`, { method: 'GET' }, { retries: 3, baseDelay: 500 });
  if (!res.ok) throw new Error('Produk tidak ditemukan');
  const data = await res.json();
  return formatProductData(data);
};

export const getProductCategories = async () => {
  try {
    const data = await getWithCache(CATEGORY_API_URL, { ttl: CACHE_TTL });
    return data;
  } catch {
    throw new Error('Gagal mengambil data kategori');
  }
};

// -------------------- Cart API --------------------
export const addToCart = async (productId, quantity = 1, token) => {
  const body = JSON.stringify({ barang_id: productId, quantity });
  const headers = getAuthHeaders(token);
  if (DEBUG) console.log('[addToCart]', { body });

  const res = await fetchWithRetry(CART_API_URL, { method: 'POST', headers, body }, { retries: 2, baseDelay: 600 });
  const txt = await res.text();

  if (!res.ok) {
    try { throw new Error(JSON.parse(txt).message || 'Gagal menambahkan ke keranjang'); }
    catch { throw new Error(`Gagal menambahkan ke keranjang (HTTP ${res.status}): ${txt}`); }
  }
  try { return JSON.parse(txt); } catch { return { message: 'OK' }; }
};

export const getCartItems = async (token) => {
  const headers = getAuthHeaders(token);
  const res = await fetchWithRetry(CART_API_URL, { method: 'GET', headers, cache: 'no-store' }, { retries: 2, baseDelay: 600 });
  const txt = await res.text();

  if (!res.ok) {
    if (res.status === 401) throw new Error('Token tidak valid, silakan login ulang');
    throw new Error(`Gagal mengambil data keranjang (HTTP ${res.status})`);
  }

  let data;
  try { data = JSON.parse(txt); } catch { throw new Error('Format response tidak valid (bukan JSON)'); }

  let arr = [];
  if (Array.isArray(data)) arr = data;
  else if (Array.isArray(data.data)) arr = data.data;
  else if (Array.isArray(data.cart)) arr = data.cart;
  else if (Array.isArray(data.items)) arr = data.items;
  else if (Array.isArray(data.keranjang)) arr = data.keranjang;
  else if (Array.isArray(data.keranjang_user)) arr = data.keranjang_user;

  return arr.map(formatCartData).filter(Boolean);
};

// ---------- Debounce update qty cart ----------
const cartUpdateBuffers = new Map(); // cartId -> { latestQty, timer, inFlight, lastSentQty }
const CART_FLUSH_DELAY = 600;

async function flushCartUpdate(cartId, token) {
  const buf = cartUpdateBuffers.get(cartId);
  if (!buf || buf.inFlight || typeof buf.latestQty !== 'number') return;

  buf.inFlight = true;
  const qty = buf.latestQty;

  const url = `${CART_API_URL}/${cartId}`;
  const body = JSON.stringify({ quantity: qty });
  const headers = getAuthHeaders(token);

  try {
    const res = await fetchWithRetry(url, { method: 'PUT', headers, body }, { retries: 2, baseDelay: 800 });
    const txt = await res.text();
    if (!res.ok) throw new Error(`Gagal mengupdate keranjang (HTTP ${res.status}): ${txt}`);
    try { JSON.parse(txt); } catch {}
    buf.lastSentQty = qty;
  } catch (e) {
    if (DEBUG) console.warn('[flushCartUpdate] gagal, reschedule:', e?.message);
    clearTimeout(buf.timer);
    buf.timer = setTimeout(() => flushCartUpdate(cartId, token), 1500);
  } finally {
    buf.inFlight = false;
  }
}

export function queueUpdateCartItemQuantity(cartId, quantity, token, delay = CART_FLUSH_DELAY) {
  if (!cartUpdateBuffers.has(cartId)) {
    cartUpdateBuffers.set(cartId, { latestQty: quantity, timer: null, inFlight: false, lastSentQty: null });
  } else {
    cartUpdateBuffers.get(cartId).latestQty = quantity;
  }

  const buf = cartUpdateBuffers.get(cartId);
  clearTimeout(buf.timer);
  buf.timer = setTimeout(() => flushCartUpdate(cartId, token), delay);
}

// (opsional) versi sinkron — jarang dipakai
export const updateCartItem = async (cartId, quantity, token) => {
  const res = await fetchWithRetry(`${CART_API_URL}/${cartId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ quantity }),
  }, { retries: 2, baseDelay: 800 });
  const txt = await res.text();
  if (!res.ok) throw new Error(`Gagal mengupdate keranjang (HTTP ${res.status}): ${txt}`);
  try { return JSON.parse(txt); } catch { return { message: 'OK' }; }
};

export const removeFromCart = async (cartId, token) => {
  const url = `${CART_API_URL}/${cartId}`;
  const headers = getAuthHeaders(token);
  const res = await fetchWithRetry(url, { method: 'DELETE', headers }, { retries: 2, baseDelay: 600 });
  const txt = await res.text();
  if (!res.ok) throw new Error(`Gagal menghapus dari keranjang (HTTP ${res.status}): ${txt}`);
  return true;
};

// -------------------- Stok realtime (buffered) --------------------
const BARANG_DETAIL_URL = (id) => `${API_URL}/${id}`;

const stockBuffers = new Map(); // productId -> { pendingDelta, timer, inFlight, lastStock, lastUkuran }
const DEFAULT_FLUSH_DELAY = 600; // ms

const resolveUkuran = (raw) => {
  const u = raw?.ukuran;
  return (typeof u === 'string' && u.trim().length > 0) ? u.trim() : '-';
};

const getProductRaw = async (productId, token) => {
  const res = await fetchWithRetry(BARANG_DETAIL_URL(productId), { method: 'GET', headers: getAuthHeaders(token) }, { retries: 2, baseDelay: 600 });
  if (!res.ok) throw new Error(`Gagal ambil produk (HTTP ${res.status})`);
  return await res.json();
};

// Prioritas: PATCH payload lengkap (tanpa foto_barang). PUT fallback jika perlu.
const setProductStockSmart = async (productId, stokTarget, ukuranKnown, token) => {
  // Ambil data penuh sekali di awal untuk menyusun payload yang lengkap
  const raw = await getProductRaw(productId, token);

  // Susun payload lengkap MINIMAL sesuai validator backend
  const payload = {
    nama_barang: raw.nama_barang ?? raw.nama ?? '',
    kategori_id: raw.kategori_id ?? raw.kategori?.id ?? null,
    harga: Number(raw.harga ?? raw.price ?? 0),
    stok: Number(stokTarget),
    deskripsi: raw.deskripsi ?? '',
    ukuran: ukuranKnown || resolveUkuran(raw),
    // ❌ JANGAN kirim foto_barang (hindari rule "must be an image")
  };

  // Validasi ringan client-side
  if (!payload.nama_barang || payload.kategori_id == null || !Number.isFinite(payload.harga)) {
    throw new Error('Data produk tidak lengkap untuk update stok (nama/kategori/harga kosong).');
  }

  // 1) Coba PATCH dengan payload lengkap
  let res = await fetchWithRetry(
    BARANG_DETAIL_URL(productId),
    {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    },
    { retries: 2, baseDelay: 800 }
  );

  let txt = await res.text();
  if (res.ok) {
    try { return JSON.parse(txt); } catch { return { message: 'OK' }; }
  } else if (DEBUG) {
    console.warn('[setProductStockSmart] PATCH full gagal:', res.status, txt);
  }

  // 2) Fallback PUT (payload sama, tetap tanpa foto_barang)
  const resPut = await fetchWithRetry(
    BARANG_DETAIL_URL(productId),
    {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    },
    { retries: 2, baseDelay: 1200 }
  );

  const putTxt = await resPut.text();
  if (!resPut.ok) {
    let msg = `Gagal set stok (HTTP ${resPut.status})`;
    try {
      const j = JSON.parse(putTxt);
      if (j.message) msg += `: ${j.message}`;
      if (j.errors) msg += ` — ${JSON.stringify(j.errors)}`;
    } catch {
      msg += `: ${putTxt}`;
    }
    throw new Error(msg);
  }

  try { return JSON.parse(putTxt); } catch { return { message: 'OK' }; }
};

// Flush buffer 1 produk
async function flushStockBuffer(productId, token) {
  const buf = stockBuffers.get(productId);
  if (!buf || buf.inFlight || buf.pendingDelta === 0) return;

  buf.inFlight = true;
  const delta = buf.pendingDelta;
  buf.pendingDelta = 0;

  try {
    // pastikan punya stok & ukuran terakhir
    if (typeof buf.lastStock !== 'number' || typeof buf.lastUkuran !== 'string') {
      const raw = await getProductRaw(productId, token);
      buf.lastStock = Number(raw?.stok ?? 0);
      buf.lastUkuran = resolveUkuran(raw);
    }

    const target = buf.lastStock + delta;
    if (target < 0) throw new Error('Stok tidak cukup');

    await setProductStockSmart(productId, target, buf.lastUkuran, token);
    buf.lastStock = target;
  } catch (e) {
    if (DEBUG) console.warn('[flushStockBuffer] gagal, requeue', { productId, err: e?.message });
    buf.pendingDelta += delta;
    clearTimeout(buf.timer);
    buf.timer = setTimeout(() => flushStockBuffer(productId, token), 1500);
  } finally {
    buf.inFlight = false;
  }
}

/**
 * Queue penyesuaian stok (delta). Akan di-flush setelah delay (default 600ms).
 * Banyak klik +/− akan digabung jadi 1 call ke server.
 */
export function queueAdjustProductStock(productId, delta, token, delay = DEFAULT_FLUSH_DELAY) {
  if (!stockBuffers.has(productId)) {
    stockBuffers.set(productId, { pendingDelta: 0, timer: null, inFlight: false, lastStock: null, lastUkuran: null });
  }
  const buf = stockBuffers.get(productId);
  buf.pendingDelta += Number(delta);

  clearTimeout(buf.timer);
  buf.timer = setTimeout(() => flushStockBuffer(productId, token), delay);
}

// Fallback sinkron (hindari saat klik beruntun). Boleh dipakai di ProductDetail saat addToCart.
export async function adjustProductStock(productId, delta, token) {
  const raw = await getProductRaw(productId, token);
  const target = Number(raw?.stok ?? 0) + Number(delta);
  if (target < 0) throw new Error('Stok tidak cukup');
  return setProductStockSmart(productId, target, resolveUkuran(raw), token);
}
