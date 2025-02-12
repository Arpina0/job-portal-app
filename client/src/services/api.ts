import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
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

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export type UserRole = 'JOB_SEEKER' | 'RECRUITER';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  token: string;
  message?: string;
}

export const register = async (userData: RegisterData): Promise<RegisterResponse> => {
  try {
    console.log('Sending registration data:', userData);
    const response = await api.post<RegisterResponse>('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export const login = async (userData: LoginData): Promise<LoginResponse> => {
  try {
    console.log('Sending login data:', userData);
    const response = await api.post<LoginResponse>('/auth/login', userData);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Login failed: ' + (error.message || 'Unknown error'));
  }
};

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  type: string;
  status: string;
  postedDate: string;
  recruiter_id: number;
  description: string;
  requirements: string;
}


export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await api.get<Job[]>('/jobs');
    console.log('All jobs response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching jobs:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
  }
};

export const fetchJobById = async (id: number): Promise<Job> => {
  try {
    const response = await api.get<Job>(`/jobs/${id}`);
    console.log('Raw job details response:', response);
    console.log('Job details data:', response.data);
    
    if (!response.data.recruiter_id) {
      console.warn('No recruiter_id in job details response:', response.data);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching job details:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to fetch job details');
  }
};

export const deleteJobById = async (id: number): Promise<void> => {
  try {
    await api.delete(`/jobs/${id}`);
  } catch (error: any) {
    console.error('Error deleting job:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to delete job');
  }
};

export interface CreateJobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  minSalary?: number;
  maxSalary?: number;
  type: string;
  recruiter_id: number;
  status: string;
}

export const createJob = async (jobData: CreateJobData): Promise<Job> => {
  try {
    const response = await api.post<Job>('/jobs', jobData);
    console.log('Create job response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating job:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to create job');
  }
};

export default api; 