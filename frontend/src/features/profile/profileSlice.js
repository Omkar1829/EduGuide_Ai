import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  loading: false,
  error: null,
  wizardCompleted: false,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
      state.wizardCompleted = action.payload?.wizardCompleted || false
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    setWizardCompleted: (state) => {
      state.wizardCompleted = true
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearProfile: (state) => {
      state.profile = null
      state.wizardCompleted = false
    },
  },
})

export const {
  setProfile,
  updateProfile,
  setWizardCompleted,
  setLoading,
  setError,
  clearProfile,
} = profileSlice.actions

export default profileSlice.reducer
