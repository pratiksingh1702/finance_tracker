import { useState, useEffect, useCallback } from 'react'

export const useFetch = (serviceMethod, params = null, autoFetch = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState(null)

  const execute = useCallback(async (newParams = params) => {
    setLoading(true)
    setError(null)
    try {
      const response = await serviceMethod(newParams)
      setData(response.data.data)
      return response.data.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [serviceMethod, params])

  useEffect(() => {
    if (autoFetch) {
      execute()
    }
  }, [autoFetch, execute])

  return { data, loading, error, execute, setData }
}
