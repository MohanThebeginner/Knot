import { cn } from '@/utils/cn'

const sizes = {
  sm: 'w-3.5 h-3.5 border',
  md: 'w-5   h-5   border-2',
  lg: 'w-7   h-7   border-2',
  xl: 'w-10  h-10  border-[3px]',
}

export function Spinner({ size = 'md', className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-current border-r-transparent animate-spin-slow',
        sizes[size] || sizes.md,
        className
      )}
    />
  )
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Spinner size="lg" className="text-accent" />
    </div>
  )
}
