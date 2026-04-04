import apiClient from './api.client'
import { ENDPOINTS } from '@/constants/api.constants'

const userService = {
  getUsers:        (params) => apiClient.get(ENDPOINTS.USERS, { params }),
  getUserById:     (id)     => apiClient.get(ENDPOINTS.USER_BY_ID(id)),
  updateUserRole:  (id, role) => apiClient.patch(ENDPOINTS.USER_ROLE(id), { role }),
  deactivateUser: (id)     => apiClient.post(ENDPOINTS.USER_DEACTIVATE(id)),
}

export default userService
