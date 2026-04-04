import apiClient from './api.client'
import { ENDPOINTS } from '@/constants/api.constants'

const authService = {
  register: (data)          => apiClient.post(ENDPOINTS.AUTH_REGISTER, data),
  login:    (data)          => apiClient.post(ENDPOINTS.AUTH_LOGIN, data),
  refresh:  (refreshToken)  => apiClient.post(ENDPOINTS.AUTH_REFRESH, { refreshToken }),
  getMe:    ()              => apiClient.get(ENDPOINTS.AUTH_ME),
}

export default authService
