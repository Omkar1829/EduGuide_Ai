import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

export const useApi = (apiCall) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiCall(...args)
        setData(response.data)
        return response.data
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'An error occurred'
        setError(message)
        toast.error(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiCall]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  }
}

export default useApi
