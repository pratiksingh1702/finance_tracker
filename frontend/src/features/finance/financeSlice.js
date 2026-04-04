import { createSlice } from '@reduxjs/toolkit'
import {
  fetchTransactionsThunk, createTransactionThunk,
  updateTransactionThunk, deleteTransactionThunk,
  fetchCategoriesThunk,
} from './financeThunks'
const initialState = {
  transactions: [], meta: null,
  categories:   [],
  selected:     null,
  loading:      false,
  submitting:   false,
  error:        null,
  filters:      { type: '', category: '', status: '', from: '', to: '', search: '', page: 1, limit: 20 },
}

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setFilters:    (s, { payload }) => { s.filters = { ...s.filters, ...payload, page: 1 } },
    setPage:       (s, { payload }) => { s.filters.page = payload },
    resetFilters:  (s) => { s.filters = initialState.filters },
    clearError:    (s) => { s.error = null },
    setSelected:   (s, { payload }) => { s.selected = payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsThunk.pending,  (s) => { s.loading = true; s.error = null })
      .addCase(fetchTransactionsThunk.fulfilled,(s, { payload }) => {
        s.loading = false; s.transactions = payload.data; s.meta = payload.meta
      })
      .addCase(fetchTransactionsThunk.rejected, (s, { payload }) => { s.loading = false; s.error = payload })

      .addCase(createTransactionThunk.pending,  (s) => { s.submitting = true })
      .addCase(createTransactionThunk.fulfilled,(s, { payload }) => {
        s.submitting = false; s.transactions.unshift(payload)
        if (s.meta) s.meta.total += 1
      })
      .addCase(createTransactionThunk.rejected, (s, { payload }) => { s.submitting = false; s.error = payload })

      .addCase(updateTransactionThunk.pending,  (s) => { s.submitting = true })
      .addCase(updateTransactionThunk.fulfilled,(s, { payload }) => {
        s.submitting = false
        const idx = s.transactions.findIndex((t) => t._id === payload._id)
        if (idx !== -1) s.transactions[idx] = payload
        if (s.selected?._id === payload._id) s.selected = payload
      })
      .addCase(updateTransactionThunk.rejected, (s, { payload }) => { s.submitting = false; s.error = payload })

      .addCase(deleteTransactionThunk.fulfilled,(s, { payload: id }) => {
        s.transactions = s.transactions.filter((t) => t._id !== id)
        if (s.meta) s.meta.total = Math.max(0, s.meta.total - 1)
      })

      .addCase(fetchCategoriesThunk.fulfilled,  (s, { payload }) => { s.categories = payload })
  },
})

export const { setFilters, setPage, resetFilters, clearError, setSelected } = financeSlice.actions
export default financeSlice.reducer