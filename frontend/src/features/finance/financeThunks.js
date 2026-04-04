import { createAsyncThunk } from '@reduxjs/toolkit'
import financeService from '@/services/finance.service'

export const fetchTransactionsThunk = createAsyncThunk(
  'finance/fetchTransactions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().finance
      const { data } = await financeService.getTransactions(filters)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions')
    }
  }
)

export const createTransactionThunk = createAsyncThunk(
  'finance/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const { data } = await financeService.createTransaction(transactionData)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create transaction')
    }
  }
)

export const updateTransactionThunk = createAsyncThunk(
  'finance/updateTransaction',
  async ({ id, data: transactionData }, { rejectWithValue }) => {
    try {
      const { data } = await financeService.updateTransaction(id, transactionData)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update transaction')
    }
  }
)

export const deleteTransactionThunk = createAsyncThunk(
  'finance/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await financeService.deleteTransaction(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete transaction')
    }
  }
)

export const fetchCategoriesThunk = createAsyncThunk(
  'finance/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await financeService.getCategories()
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories')
    }
  }
)
