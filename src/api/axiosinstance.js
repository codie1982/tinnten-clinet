import axios from 'axios';
import { toast } from 'react-toastify';
import API_URL from "../common/baseurl";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // 🌟 Burada tanımlanırsa tüm isteklerde geçerli olur
});

// 🚀 Silent Authentication Function (Backend üzerinden istek)
const silentAuth = async () => {
    try {
        console.log("API_URL", API_URL)
        const response = await axios.post(`${API_URL}auth/refresh-token`, {}, {
            withCredentials: true, // ✅ Cookie'nin gönderilmesi için gerekli
        });
        const newToken = response.data.access_token;
        localStorage.setItem('access_token', newToken);
        return newToken;
    } catch (error) {
        throw new Error('Silent auth failed.');
    }
};

// ✅ Request Interceptor (Token otomatik eklenir)
axiosInstance.interceptors.request.use(
    (config) => {
        if (!config.skipAuth) {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
         // Sadece JSON istekleri için Content-Type
         if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("error", error)
        if ((error.response && error.response.status === 404) || (error.response && error.response.status === 400)  && !error.config._retry) {
            error.config._retry = true;
            const response = error.response
            const errorMessage = response.data.message
            toast.error(errorMessage)
        }
        return Promise.reject(error);
    }
);
// ❌ Response Interceptor (401 durumunda Silent Auth çalışır)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("error.response",error.response)
        if ((error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) && !error.config._retry && !error.config.skipAuth) {
            error.config._retry = true; // Sonsuz döngüyü engellemek için
            try {
                const newToken = await silentAuth();
                if (newToken) {
                    error.config.headers['Authorization'] = `Bearer ${newToken}`;
                    return axiosInstance(error.config);
                } else {
                    toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
                    localStorage.clear();
                    window.location.href = '/login';
                }
            } catch (silentAuthError) {
                console.log("silentAuthError", silentAuthError)
                toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(silentAuthError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
