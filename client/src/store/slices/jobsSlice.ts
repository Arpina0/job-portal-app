import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJobs, fetchJobById, Job } from '../../services/api';

interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
};

export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const jobs = await fetchJobs();
      return jobs;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchDetails',
  async (id: number, { rejectWithValue }) => {
    try {
      const job = await fetchJobById(id);
      return job;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobsError: (state) => {
      state.error = null;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJobDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload;
        state.error = null;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearJobsError, clearSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer; 