import { cn } from '@/utils/cn'
import { Spinner } from './Spinner'

const variants = {
  primary:   'bg-accent text-white hover:bg-accent-hover active:scale-[0.98]',
  secondary: 'bg-surface-2 text-text-primary hover:bg-border active:scale-[0.98]',
  ghost:     'bg-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary',
  danger:    'bg-transparent text-error hover:bg-error/10 border border-error/30 hover:border-error/60',
  outline:   'bg-transparent border border-border text-text-primary hover:bg-surface-2',
}

const sizes = {
  xs: 'h-7  px-2.5 text-xs  gap-1.5',
  sm: 'h-8  px-3   text-sm  gap-1.5',
  md: 'h-9  px-4   text-sm  gap-2',
  lg: 'h-10 px-5   text-sm  gap-2',
}

export function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  fullWidth = false,
  className,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        // Base
        'inline-flex items-center justify-center font-medium rounded transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
        'select-none whitespace-nowrap',
        // Variant
        variants[variant] || variants.primary,
        // Size
        sizes[size] || sizes.md,
        // States
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        fullWidth  && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}
