const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  } catch {
    throw new Error('Tidak dapat terhubung ke Mock API. Pastikan `npm run api` sedang berjalan.');
  }
  if (!response.ok) throw new Error(`Permintaan gagal (${response.status}). Coba lagi.`);
  if (response.status === 204) return null;
  return response.json();
}

export const getWasteTypes = () => request('/wasteTypes');
export const getBanks = () => request('/banks');
export const getBankById = async (id) => {
  const banks = await getBanks();
  return banks.find((bank) => String(bank.id) === String(id)) || null;
};
export const createPickupRequest = (payload) => request('/pickupRequests', {
  method: 'POST',
  body: JSON.stringify({ ...payload, status: 'Menunggu konfirmasi', createdAt: new Date().toISOString() }),
});
export const getDeposits = () => request('/deposits?_sort=date&_order=desc');
export const createDeposit = (payload) => request('/deposits', {
  method: 'POST',
  body: JSON.stringify({ ...payload, date: payload.date || new Date().toISOString().slice(0, 10), status: 'Selesai', createdAt: new Date().toISOString() }),
});
