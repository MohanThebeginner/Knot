import { cn } from '@/utils/cn'

const variants = {
  default: 'bg-surface-2 text-text-secondary',
  accent:  'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  error:   'bg-error/10   text-error',
}

export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  )
}
