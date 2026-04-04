import { useMemo } from 'react'

export const usePagination = (totalItems, pageSize, currentPage) => {
  const totalPages = Math.ceil(totalItems / pageSize)

  const paginationRange = useMemo(() => {
    const range = []
    for (let i = 1; i <= totalPages; i++) {
      range.push(i)
    }
    return range
  }, [totalPages])

  return {
    totalPages,
    paginationRange,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }
}
