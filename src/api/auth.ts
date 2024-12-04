import { apiClient } from './client';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password2: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>('/users/login/', credentials);
    return response.data;
  },
  
  register: async (credentials: RegisterCredentials) => {
    const response = await apiClient.post<AuthResponse>('/users/register/', credentials);
    return response.data;
  },
  
  logout: async (refresh_token: string) => {
    await apiClient.post('/users/logout/', { refresh_token });
  },
  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await apiClient.post('/users/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};