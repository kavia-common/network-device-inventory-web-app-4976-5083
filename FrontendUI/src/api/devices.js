/**
 * Devices API module: wraps REST calls to the backend.
 */
import apiClient from './client';

// PUBLIC_INTERFACE
export async function listDevices({ page = 1, per_page = 10, type = '' } = {}) {
  /** List devices with server-side pagination and optional type filter. */
  const params = {};
  if (page) params.page = page;
  if (per_page) params.per_page = per_page;
  if (type) params.type = type;
  const res = await apiClient.get('/devices', { params });
  // Some backends may return array; others return {items,total}. Normalize here.
  const data = res.data;
  if (Array.isArray(data)) {
    return { items: data, total: data.length };
  }
  const items = data.items ?? data.results ?? data.data ?? [];
  const total = data.total ?? items.length;
  return { items, total };
}

// PUBLIC_INTERFACE
export async function getDevice(id) {
  /** Get a single device by id. */
  const res = await apiClient.get(`/devices/${id}`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function createDevice(payload) {
  /** Create a device. */
  const res = await apiClient.post('/devices', payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateDevice(id, payload) {
  /** Update a device by id (PUT full update). */
  const res = await apiClient.put(`/devices/${id}`, payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteDevice(id) {
  /** Delete device by id. */
  const res = await apiClient.delete(`/devices/${id}`);
  return res.status === 204 ? true : res.data;
}

// PUBLIC_INTERFACE
export async function pingDevice(id) {
  /** Ping a device by id. */
  const res = await apiClient.get(`/devices/${id}/ping`);
  return res.data;
}
