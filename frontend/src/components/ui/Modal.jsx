import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  bodyClassName,
  widthClassName = 'max-w-md md:max-w-lg',
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0,   y: 4,  scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              className={cn(
                'pointer-events-auto w-full min-w-0',
                widthClassName,
                'bg-surface border border-border rounded-lg shadow-xl',
                'max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)]',
                'overflow-y-auto overflow-x-hidden [overflow-wrap:anywhere]',
                className
              )}
            >
              {title && (
                <div className="flex min-w-0 items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 border-b border-border">
                  <h3 id="modal-title" className="min-w-0 text-base font-semibold text-text-primary break-words">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="shrink-0 p-1 rounded hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Close modal"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              )}
              <div className={cn('min-w-0 p-4 sm:p-5', bodyClassName)}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
