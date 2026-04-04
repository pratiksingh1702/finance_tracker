import React, { useState } from 'react'
import { cn } from '@/utils/cn'

const Tooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = useState(false)

  const positions = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={cn(
          'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded shadow-sm whitespace-nowrap animate-in fade-in duration-200',
          positions[position]
        )}>
          {content}
          <div className={cn(
            'absolute w-2 h-2 bg-slate-900 rotate-45',
            position === 'top' && 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
            position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
            position === 'left' && 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2',
            position === 'right' && 'right-full top-1/2 -translate-y-1/2 translate-x-1/2'
          )} />
        </div>
      )}
    </div>
  )
}

export default Tooltip
