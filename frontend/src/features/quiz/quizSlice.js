import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  currentQuiz: null,
  results: null,
  history: [],
  loading: false,
  error: null,
}

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setCurrentQuiz: (state, action) => {
      state.currentQuiz = action.payload
    },
    setResults: (state, action) => {
      state.results = action.payload
    },
    setHistory: (state, action) => {
      state.history = action.payload
    },
    clearResults: (state) => {
      state.results = null
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
  setCategories,
  setCurrentQuiz,
  setResults,
  setHistory,
  clearResults,
  setLoading,
  setError,
} = quizSlice.actions

export default quizSlice.reducer
