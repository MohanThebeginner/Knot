import { useNotifications } from '@/hooks/useNotifications'
import { NotificationItem } from '@/components/ui/NotificationItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useNavigate } from 'react-router-dom'

function NotificationsPage() {
  const { notifications, loading, markAsRead } = useNotifications()
  const navigate = useNavigate()

  const handleNotificationClick = (notification) => {
    // Navigate to the post that triggered the notification
    if (notification.post) {
      navigate(`/posts/${notification.post._id || notification.post}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border sticky top-0 bg-bg/95 backdrop-blur">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={markAsRead}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationItem
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8">
          <EmptyState
            icon="🔔"
            title="No notifications"
            message="You're all caught up! Come back later for updates."
          />
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
