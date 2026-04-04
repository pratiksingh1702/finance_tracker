import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import styles from './Modal.module.css'

const Modal = ({ isOpen, onClose, title, children, footer, className }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={cn(styles.content, className)} 
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default Modal
