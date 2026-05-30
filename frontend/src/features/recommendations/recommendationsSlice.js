import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  recommendations: [],
  aiRecommendations: [],
  loading: false,
  error: null,
}

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendations: (state, action) => {
      state.recommendations = action.payload
    },
    setAiRecommendations: (state, action) => {
      state.aiRecommendations = action.payload
    },
    addRecommendation: (state, action) => {
      state.recommendations.push(action.payload)
    },
    removeRecommendation: (state, action) => {
      state.recommendations = state.recommendations.filter(
        (rec) => rec.id !== action.payload
      )
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setRecommendations,
  setAiRecommendations,
  addRecommendation,
  removeRecommendation,
  setLoading,
  setError,
} = recommendationsSlice.actions

export default recommendationsSlice.reducer
