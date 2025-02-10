import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'JOB_SEEKER' | 'RECRUITER';
}

export interface RegisterResponse {
  token: string;
  message?: string;
}

export const register = async (userData: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export default api; 