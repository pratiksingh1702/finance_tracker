import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import authReducer from '@/features/auth/authSlice'
import financeReducer from '@/features/finance/financeSlice'
import analyticsReducer from '@/features/analytics/analyticsSlice'
import userReducer from '@/features/user/userSlice'

// Function to create a mock store
export const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      finance: financeReducer,
      analytics: analyticsReducer,
      user: userReducer,
    },
    preloadedState,
  })
}

// Custom render function that includes Redux and Router
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    route = '/',
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Function to render with real router (for full flow testing)
export function renderWithRouter(
  routes,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) {
  const router = createMemoryRouter(routes, { initialEntries })

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )
  }

  return { 
    store, 
    router, 
    ...render(null, { wrapper: Wrapper, ...renderOptions }) 
  }
}
