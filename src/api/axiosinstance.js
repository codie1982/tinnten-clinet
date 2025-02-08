import axios from 'axios';
import { toast } from 'react-toastify';
import BASE_URL from "../common/baseurl";

const API_URL = BASE_URL + "/api/v10/";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// ✅ Request Interceptor (Token otomatik eklenir)
axiosInstance.interceptors.request.use(
    (config) => {
        // 🔑 Token kontrolü yapılmasını istemiyorsan skipAuth: true ekle
        if (!config.skipAuth) {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ❌ Response Interceptor (401 durumunda yönlendirme yapılır)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 && !error.config.skipAuth) {
            toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;