import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { useToastContext } from '@/contexts/ToastContext'

const icons = {
  success: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M4 4l7 7M11 4l-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7.5 5v1M7.5 7.5v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  ),
}

const styles = {
  success: 'bg-success/10 border-success/30 text-success',
  error:   'bg-error/10   border-error/30   text-error',
  info:    'bg-accent/10  border-accent/30  text-accent',
}

function Toast({ id, message, type, duration }) {
  const { removeToast } = useToastContext()

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0,   y: -4, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn(
        'flex items-start gap-2.5 px-4 py-3 rounded-lg border text-sm font-medium',
        'shadow-sm max-w-sm w-full cursor-pointer select-none',
        styles[type] || styles.info
      )}
      onClick={() => removeToast(id)}
      role="alert"
    >
      <span className="flex-shrink-0 mt-[1px]">{icons[type]}</span>
      <span className="flex-1 leading-snug">{message}</span>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts } = useToastContext()

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="sync">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
