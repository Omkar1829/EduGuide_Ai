import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchProfile,
} from '../../store/slices/authSlice'
import { ROUTES } from '../../utils/constants'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const login = useCallback(
    async (credentials) => {
      try {
        const resultAction = await dispatch(loginUser(credentials))
        if (loginUser.fulfilled.match(resultAction)) {
          toast.success('Welcome back!')
          navigate(ROUTES.DASHBOARD)
        } else {
          const message = resultAction.payload || 'Login failed'
          toast.error(message)
        }
      } catch (error) {
        toast.error('Login failed')
      }
    },
    [dispatch, navigate]
  )

  const register = useCallback(
    async (userData) => {
      try {
        const resultAction = await dispatch(registerUser(userData))
        if (registerUser.fulfilled.match(resultAction)) {
          toast.success('Account created successfully!')
          navigate(ROUTES.PROFILE_WIZARD)
        } else {
          const message = resultAction.payload || 'Registration failed'
          toast.error(message)
        }
      } catch (error) {
        toast.error('Registration failed')
      }
    },
    [dispatch, navigate]
  )

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser())
      toast.info('Logged out successfully')
      navigate(ROUTES.LOGIN)
    } catch (error) {
      toast.error('Logout failed')
    }
  }, [dispatch, navigate])

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('accessToken')
    if (token && !isAuthenticated) {
      dispatch(fetchProfile())
    }
  }, [dispatch, isAuthenticated])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  }
}

export default useAuth
