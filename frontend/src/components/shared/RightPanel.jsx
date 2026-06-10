import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'

export function RightPanel() {
  const { isAuthenticated, user } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 py-6 px-3 gap-4">
      {isAuthenticated ? (
        <AuthedPanel user={user} />
      ) : (
        <GuestPanel />
      )}

      {/* Extension point: future widgets (trending, recommendations, etc.) */}
    </aside>
  )
}

function AuthedPanel({ user }) {
  const { unreadCount } = useNotifications()

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar username={user.username} size="lg" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">
            {user.username}
          </p>
          <p className="text-xs text-text-secondary">Member</p>
        </div>
      </div>
      <Divider />
      <Link to="/posts/new">
        <Button variant="primary" size="sm" fullWidth>
          <PlusIcon />
          New Post
        </Button>
      </Link>
      <Link to="/profile">
        <Button variant="ghost" size="sm" fullWidth>
          View Profile
        </Button>
      </Link>
      <Link to="/notifications">
        <Button variant="ghost" size="sm" fullWidth className="relative">
          <BellIcon />
          Notifications
          {unreadCount > 0 && (
            <span className="absolute right-3 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </Link>
    </div>
  )
}

function GuestPanel() {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          Join Knots
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Create an account to post, comment, and join the discussion.
        </p>
      </div>
      <Divider />
      <Link to="/register">
        <Button variant="primary" size="sm" fullWidth>
          Get started
        </Button>
      </Link>
      <Link to="/login">
        <Button variant="outline" size="sm" fullWidth>
          Log in
        </Button>
      </Link>
    </div>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
