import { useToastContext } from '@/contexts/ToastContext'

/**
 * Convenience hook for firing toasts from any component.
 *
 * Usage:
 *   const toast = useToast()
 *   toast.success('Post created!')
 *   toast.error('Something went wrong.')
 */
export function useToast() {
  const { toast } = useToastContext()
  return toast
}
