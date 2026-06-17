import { useNotifications } from '@/hooks/useNotifications'
import { NotificationItem } from '@/components/ui/NotificationItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'

export function NotificationCenter({ onClose }) {
  const { notifications, loading, markAsRead } = useNotifications()

  const handleMarkAsRead = async () => {
    await markAsRead()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-col h-full overflow-hidden bg-bg">
      {/* Header */}
      <div className="flex min-w-0 items-center justify-between gap-2 px-3 md:px-4 py-3 md:py-4 border-b border-border sticky top-0 bg-bg">
        <h2 className="min-w-0 truncate text-base md:text-lg font-semibold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAsRead}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClick={onClose}
            />
          ))
        ) : (
          <div className="p-3 md:p-4">
            <EmptyState
              icon="🔔"
              title="No notifications"
              message="You're all caught up!"
            />
          </div>
        )}
      </div>
    </div>
  )
}
