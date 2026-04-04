import React from 'react'
import { cn } from '@/utils/cn'
import styles from './Input.module.css'

const Input = React.forwardRef(({ 
  label, 
  error, 
  className, 
  id, 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={cn(
          styles.input,
          error && styles.error,
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
