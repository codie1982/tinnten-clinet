import axios from 'axios';
import { toast } from 'react-toastify';
import API_URL from "../common/baseurl";
console.log("API_URL", API_URL)
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 🌟 Burada tanımlanırsa tüm isteklerde geçerli olur
    timeout: 10000, // 10 saniyelik timeout ekliyoruz
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
        console.log("error.response", error.response);

        const originalRequest = error.config;

        if (error.response) {
            const status = error.response.status;

            if ((status === 400 || status === 404) && !originalRequest._retry) {
                console.log("error.response.data", error.response.data);
                originalRequest._retry = true;
                const errorMessage = error.response.data.message;
                toast.error(errorMessage);
                return Promise.reject(error);
            }

            if ((status === 401 || status === 403 || status === 500) && !originalRequest._retry && !originalRequest.skipAuth) {
                originalRequest._retry = true;
                try {
                    const newToken = await silentAuth();
                    if (newToken) {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axiosInstance(originalRequest);
                    } else {
                        toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
                        localStorage.clear();
                        //window.location.href = '/login';
                    }
                } catch (silentAuthError) {
                    console.log("silentAuthError", silentAuthError);
                    toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
                    localStorage.clear();
                    //window.location.href = '/login';
                    return Promise.reject(silentAuthError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
