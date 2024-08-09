import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_BACK,
});

// Adicione um interceptor para incluir o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;