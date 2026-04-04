
/**
 * Transform raw monthly trend data → Recharts-ready format.
 */
export const transformMonthlyTrends = (data = []) =>
  data.map((row) => ({
    period:        row.period,
    income:        row.totalIncome,
    expenses:      row.totalExpenses,
    net:           row.net,
    runningBalance:row.runningBalance,
    label:         row.period,
  }))

/**
 * Transform category breakdown → pie-chart-ready format.
 */
export const transformCategoryPie = (data = [], type = 'expense') =>
  data
    .filter((r) => (type === 'expense' ? r.totalExpenses > 0 : r.totalIncome > 0))
    .map((r) => ({
      name:  r.categoryName,
      value: type === 'expense' ? r.totalExpenses : r.totalIncome,
      color: r.categoryColor,
      share: type === 'expense' ? r.expenseShare : r.incomeShare,
    }))

/**
 * Compute quick KPI deltas (compare current vs previous period).
 * Returns percentage change rounded to 1 decimal.
 */
export const computeDelta = (current, previous) => {
  if (!previous || previous === 0) return null
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10
}

/**
 * Flatten paginated API response.
 */
export const flattenPaginated = (response) => ({
  data: response?.data?.data ?? [],
  meta: response?.data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 },
})