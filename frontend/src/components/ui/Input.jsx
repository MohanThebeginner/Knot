import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    className,
    containerClassName,
    required,
    ...props
  },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'input-base',
          error && 'input-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-secondary">{hint}</p>
      )}
    </div>
  )
})
