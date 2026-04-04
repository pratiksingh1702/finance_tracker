import { createSelector } from '@reduxjs/toolkit'

const selectFinance = (state) => state.finance

export const selectTransactions = createSelector(selectFinance, (f) => f.transactions)
export const selectCategories = createSelector(selectFinance, (f) => f.categories)
export const selectFinanceLoading = createSelector(selectFinance, (f) => f.loading)
export const selectFinanceError = createSelector(selectFinance, (f) => f.error)
export const selectFinanceFilters = createSelector(selectFinance, (f) => f.filters)
export const selectFinanceMeta = createSelector(selectFinance, (f) => f.meta)
