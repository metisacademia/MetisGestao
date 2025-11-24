export async function apiCall(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers || {});
  
  // Adiciona token ao header se existir
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
