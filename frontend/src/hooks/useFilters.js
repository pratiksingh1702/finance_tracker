import { useState, useCallback } from 'react'

export const useFilters = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters)

  const updateFilter = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  return { filters, updateFilter, resetFilters, setFilters }
}
