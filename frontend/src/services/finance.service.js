import apiClient from './api.client'
import { ENDPOINTS } from '@/constants/api.constants'

const financeService = {
  // Transactions
  getTransactions: (params) => apiClient.get(ENDPOINTS.TRANSACTIONS, { params }),
  getTransaction:  (id)     => apiClient.get(ENDPOINTS.TRANSACTION_BY_ID(id)),
  createTransaction:(data)  => apiClient.post(ENDPOINTS.TRANSACTIONS, data),
  updateTransaction:(id, data) => apiClient.patch(ENDPOINTS.TRANSACTION_BY_ID(id), data),
  deleteTransaction:(id)    => apiClient.delete(ENDPOINTS.TRANSACTION_BY_ID(id)),

  // Categories
  getCategories: (params) => apiClient.get(ENDPOINTS.CATEGORIES, { params }),
  getCategory:   (id)     => apiClient.get(ENDPOINTS.CATEGORY_BY_ID(id)),
  createCategory:(data)   => apiClient.post(ENDPOINTS.CATEGORIES, data),
  updateCategory:(id, d)  => apiClient.patch(ENDPOINTS.CATEGORY_BY_ID(id), d),
  deleteCategory:(id)     => apiClient.delete(ENDPOINTS.CATEGORY_BY_ID(id)),
}

export default financeService
