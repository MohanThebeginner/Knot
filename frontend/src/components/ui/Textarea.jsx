import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    rows = 4,
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
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'input-base resize-y min-h-[100px]',
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
