export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://thecandlelab-0td4.onrender.com/api';

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
