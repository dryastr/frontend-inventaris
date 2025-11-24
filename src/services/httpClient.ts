const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8001/api';
console.log('API_BASE:', API_BASE);

export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }
    console.log('API Error:', response.status, errorData);
    const error: any = new Error(errorData.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.errors = errorData.errors;
    throw error;
  }

  return response;
};

export { API_BASE };