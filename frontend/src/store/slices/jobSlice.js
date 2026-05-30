import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobService from "../../services/jobService";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getAllJobs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobById(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSavedJobs = createAsyncThunk(
  "jobs/fetchSavedJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getSavedJobs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveJob = createAsyncThunk(
  "jobs/saveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobService.saveJob(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobStatus = createAsyncThunk(
  "jobs/updateJobStatus",
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      const response = await jobService.updateJobStatus(jobId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeSavedJob = createAsyncThunk(
  "jobs/removeSavedJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await jobService.removeSavedJob(jobId);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  jobs: [],
  savedJobs: [],
  currentJob: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobs: (state) => {
      state.jobs = [];
      state.pagination = initialState.pagination;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload?.jobs || action.payload || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload?.jobs || action.payload || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(saveJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs.push(action.payload);
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateJobStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.savedJobs.findIndex(
          (j) => j.id === action.payload.id
        );
        if (index !== -1) {
          state.savedJobs[index] = action.payload;
        }
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeSavedJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSavedJob.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = state.savedJobs.filter(
          (j) => j.jobId !== action.payload && j.id !== action.payload
        );
      })
      .addCase(removeSavedJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobs, clearCurrentJob, clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
