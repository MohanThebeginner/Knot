import { useNotifications } from '@/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'

export function NotificationBell({ onClick }) {
  const { unreadCount } = useNotifications()
  const { user } = useAuth()

  if (!user) return null

  return (
    <button
      onClick={onClick}
      aria-label="Notifications"
      className="relative p-2 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}
