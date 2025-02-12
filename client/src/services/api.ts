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

export const updateJob = async (id: number, jobData: CreateJobData): Promise<Job> => {
  try {
    console.log('Sending update request for job:', id);
    
    // Format the data to match backend expectations
    const formattedData = {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      description: jobData.description,
      requirements: jobData.requirements,
      minSalary: jobData.minSalary,
      maxSalary: jobData.maxSalary,
      type: jobData.type,
      status: jobData.status,
      recruiter_id: jobData.recruiter_id
    };

    console.log('Update data being sent:', formattedData);
    
    const response = await api.put<Job>(`/jobs/${id}`, formattedData);
    console.log('Update job response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating job:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || 'Failed to update job');
  }
};

export interface JobApplication {
  id: number;
  job_id: number;
  applicant_id: number;
  status: string;
}

export const applyForJob = async (jobId: number): Promise<void> => {
  try {
    const response = await api.post(`/applications/${jobId}`);
    console.log('Application response:', response.data);
  } catch (error: any) {
    console.error('Application error:', error);
    throw new Error(error.response?.data || 'Failed to apply for job');
  }
};

export const checkJobApplication = async (jobId: number): Promise<boolean> => {
  try {
    console.log('Checking applications for job:', jobId);
    const response = await api.get<JobApplication[]>('/applications');
    console.log('All user applications:', response.data);
    const hasApplied = response.data.some(app => app.job_id === jobId);
    console.log('Has applied:', hasApplied);
    return hasApplied;
  } catch (error: any) {
    console.error('Error checking job application:', error);
    return false;
  }
};

export default api; 