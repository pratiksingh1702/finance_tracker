import React from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from '@/store'

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </Provider>
  )
}

export default AppProviders
