import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

export function BottomNav() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg border-t border-border">
      <div className="flex items-stretch h-14">
        <MobileNavLink to="/" end label="Home" icon={<HomeIcon />} />
        {isAuthenticated && (
          <MobileNavLink to="/posts/new" label="Post" icon={<PlusIcon />} />
        )}
        {isAuthenticated ? (
          <MobileNavLink to="/profile" label="Profile" icon={<ProfileIcon />} />
        ) : (
          <MobileNavLink to="/login" label="Log in" icon={<ProfileIcon />} />
        )}
        {isAuthenticated && (
          <MobileNavLink to="/settings" label="Settings" icon={<SettingsIcon />} />
        )}
      </div>
    </nav>
  )
}

function MobileNavLink({ to, end, label, icon }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
          isActive
            ? 'text-accent'
            : 'text-text-secondary'
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 8L10 3l7 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7.5 18V11h5v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 6.5v7M6.5 10h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 17.5c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.4 4.4l1.42 1.42M14.18 14.18l1.42 1.42M4.4 15.6l1.42-1.42M14.18 5.82l1.42-1.42"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
