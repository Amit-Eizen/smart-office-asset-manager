import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

const API_AUTH_URL = import.meta.env.VITE_AUTH_API_URL;

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_AUTH_URL}/login`, credentials);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_AUTH_URL}/register`, data);
        return response.data;
    }
};