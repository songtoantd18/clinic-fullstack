import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },

  /**
   * 👉 CỰC KỲ QUAN TRỌNG
   * Cho phép mọi status code đều resolve
   * => backend trả gì FE nhận y nguyên
   */
  validateStatus: () => true,
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor (KHÔNG xử lý gì)
client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error), // chỉ throw network error
);

export default client;
