import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload
    },
    enrollInCourse: (state, action) => {
      state.enrolledCourses.push(action.payload)
    },
    updateProgress: (state, action) => {
      const { courseId, progress } = action.payload
      const course = state.enrolledCourses.find((c) => c.id === courseId)
      if (course) course.progress = progress
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
  setCourses,
  setEnrolledCourses,
  setCurrentCourse,
  enrollInCourse,
  updateProgress,
  setLoading,
  setError,
  setPagination,
} = coursesSlice.actions

export default coursesSlice.reducer
