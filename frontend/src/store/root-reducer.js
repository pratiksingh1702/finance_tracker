import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import financeReducer from '@/features/finance/financeSlice'
import analyticsReducer from '@/features/analytics/analyticsSlice'
import userReducer from '@/features/user/userSlice'

const rootReducer = combineReducers({
  auth:      authReducer,
  finance:   financeReducer,
  analytics: analyticsReducer,
  user:      userReducer,
})

export default rootReducer
