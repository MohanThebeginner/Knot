import { cn } from '@/utils/cn'

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && (
        <div className="mb-4 text-text-secondary opacity-40">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action && action}
    </div>
  )
}
