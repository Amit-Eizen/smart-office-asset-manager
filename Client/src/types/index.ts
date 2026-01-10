
//User types
export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'Member';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    role: 'Admin' | 'Member';
}

export interface AuthResponse {
  token: string;
}

//Asset types
export interface Asset {
    id: string;
    name: string;
    type: string;
    status: string;
}

export interface CreateAssetRequest {
    name: string;
    type: string;
    status: string;
}