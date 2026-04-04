import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div className={cn(
          'absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in duration-100',
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

const DropdownItem = ({ children, onClick, className }) => (
  <button
    className={cn(
      'block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors',
      className
    )}
    onClick={() => {
      onClick?.()
      // setIsOpen(false) // This needs to be handled via context or prop if we want it here
    }}
  >
    {children}
  </button>
)

export { Dropdown, DropdownItem }
