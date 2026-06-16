import { formatDate } from '@/utils/formatDate'
import { cn } from '@/utils/cn'

export function NotificationItem({ notification, onClick }) {
  const { type, message, createdAt, read } = notification

  const iconColor = {
    like: 'text-red-500',
    comment: 'text-blue-500',
  }[type] || 'text-gray-500'

  const icon = {
    like: '❤️',
    comment: '💬',
  }[type] || '🔔'

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-3 md:px-4 py-3 md:py-4 text-left border-b border-border hover:bg-surface-2 transition-colors active:bg-surface-1',
        !read && 'bg-surface-1'
      )}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <span className={`text-lg md:text-xl flex-shrink-0 ${iconColor}`}>{icon}</span>

        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-text-primary line-clamp-2">{message}</p>
          <p className="text-xs text-text-secondary mt-1">{formatDate(createdAt)}</p>
        </div>

        {!read && (
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1 md:mt-2" />
        )}
      </div>
    </button>
  )
}
