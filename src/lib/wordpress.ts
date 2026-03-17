const BASE = import.meta.env.VITE_WP_BASE_URL || '';
const API = `${BASE}/wp-json/wp/v2`;

export async function wpFetch<T>(
  path: string,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${API}${path}`, { signal });
  if (!res.ok) {
    throw new Error(`WP API ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function wpPost<T>(
  path: string,
  body: FormData,
  signal?: AbortSignal
): Promise<T> {
  const url = `${BASE}/wp-json${path}`;
  const res = await fetch(url, {
    method: 'POST',
    body,
    signal,
  });
  return res.json() as Promise<T>;
}
