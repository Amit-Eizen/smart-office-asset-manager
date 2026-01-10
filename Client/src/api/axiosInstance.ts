import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_RESOURCE_API_URL,
});

// Interceptor to add token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
