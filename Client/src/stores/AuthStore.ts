import { makeAutoObservable } from "mobx";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/authService";
import type { LoginRequest, RegisterRequest } from "../types";

interface JwtPayload {
    sub?: string;
    nameid?: string;
    name?: string;
    unique_name?: string;
    role?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

class AuthStore {
    token: string | null = null;
    userId: string | null = null;
    username: string | null = null;
    role: 'Admin' | 'Member' | null = null;
    isAuthenticated: boolean = false;
    isInitialized: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.loadTokenFromLocalStorage();
    }

    private loadTokenFromLocalStorage() {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            this.token = storedToken;
            this.decodeToken(storedToken);
        }
        this.isInitialized = true;
    }

    private decodeToken(token: string) {
        try {
            const payload = jwtDecode<JwtPayload>(token);
            this.userId = payload.sub || payload.nameid || null;
            this.username = payload.name || payload.unique_name || null;
            this.role = (payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null) as 'Admin' | 'Member' | null;
            this.isAuthenticated = true;
        } catch (error) {
            console.error("Failed to decode token:", error);
            this.logout();
        }
    }

    async login(credentials: LoginRequest) {
        try {
            const response = await authService.login(credentials);
            this.token = response.token;
            localStorage.setItem("token", response.token);
            this.decodeToken(response.token);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }

    async register(data: RegisterRequest) {
        try {
            const response = await authService.register(data);
            this.token = response.token;
            localStorage.setItem("token", response.token);
            this.decodeToken(response.token);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.userId = null;
        this.username = null;
        this.role = null;
        this.isAuthenticated = false;
        localStorage.removeItem("token");
    }
}

export const authStore = new AuthStore();