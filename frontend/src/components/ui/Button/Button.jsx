import React from 'react'
import { cn } from '@/utils/cn'
import styles from './Button.module.css'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  loading = false, 
  disabled = false,
  ...props 
}) => {
  return (
    <button
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.loading,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      <span className={cn(loading && 'opacity-0')}>{children}</span>
    </button>
  )
}

export default Button
