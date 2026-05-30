import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jobs: [],
  savedJobs: [],
  appliedJobs: [],
  currentJob: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload
    },
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload
    },
    setAppliedJobs: (state, action) => {
      state.appliedJobs = action.payload
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload
    },
    saveJob: (state, action) => {
      state.savedJobs.push(action.payload)
    },
    unsaveJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter((job) => job.id !== action.payload)
    },
    applyToJob: (state, action) => {
      state.appliedJobs.push(action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setPagination: (state, action) => {
      state.pagination = action.payload
    },
  },
})

export const {
  setJobs,
  setSavedJobs,
  setAppliedJobs,
  setCurrentJob,
  saveJob,
  unsaveJob,
  applyToJob,
  setLoading,
  setError,
  setPagination,
} = jobsSlice.actions

export default jobsSlice.reducer
