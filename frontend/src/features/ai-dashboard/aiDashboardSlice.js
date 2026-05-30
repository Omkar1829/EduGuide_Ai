import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  analysis: null,
  recommendations: [],
  loading: false,
  error: null,
}

const aiDashboardSlice = createSlice({
  name: 'aiDashboard',
  initialState,
  reducers: {
    setAnalysis: (state, action) => {
      state.analysis = action.payload
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearAnalysis: (state) => {
      state.analysis = null
      state.recommendations = []
    },
  },
})

export const {
  setAnalysis,
  setRecommendations,
  setLoading,
  setError,
  clearAnalysis,
} = aiDashboardSlice.actions

export default aiDashboardSlice.reducer
