export const API_BASE = 'https://shop.cyberlearn.vn/api';
export async function apiGet(path: string) {
  const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}
export async function apiPost(path: string, body: unknown, token?: string) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Yêu cầu thất bại (${response.status})`);
  return data;
}
export function unwrap<T = any>(data: any): T {
  return (data?.content ?? data?.data?.content ?? data?.data ?? data) as T;
}
