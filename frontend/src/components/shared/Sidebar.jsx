import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useToast } from '@/hooks/useToast'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'

const navItems = [
  {
    to: '/',
    end: true,
    label: 'Home',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M2 6.5L8.5 2L15 6.5V14a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M6 15V9h5v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: '/posts/new',
    label: 'New Post',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="2" y="2" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8.5 5.5v6M5.5 8.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    requiresAuth: true,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2.5 14.5c0-2.761 2.686-5 6-5s6 2.239 6 5"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    requiresAuth: true,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8.5 2v1.5M8.5 13.5V15M2 8.5h1.5M13.5 8.5H15M3.7 3.7l1.06 1.06M12.24 12.24l1.06 1.06M3.7 13.3l1.06-1.06M12.24 4.76l1.06-1.06"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    requiresAuth: true,
  },
]

export function Sidebar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { isDark, toggleTheme }           = useTheme()
  const toast                             = useToast()
  const navigate                          = useNavigate()

  function handleLogout() {
    logout()
    toast.success('Logged out successfully.')
    navigate('/')
  }

  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0 h-screen sticky top-0 border-r border-border bg-bg py-5 px-3">
      {/* Logo */}
      <NavLink
        to="/"
        className="px-3 mb-6 flex items-center gap-2 group"
      >
        <img src={isDark ? '/brandD.png' : '/brand.png'} alt="Logo" className="h-8 w-auto" />
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {navItems.map((item) => {
          if (item.requiresAuth && !isAuthenticated) return null
          return (
            <SidebarLink key={item.to} {...item} />
          )
        })}
      </nav>

      {/* Bottom controls */}
      <div className="flex flex-col gap-1 pt-3 border-t border-border">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors w-full text-left"
          aria-label="Toggle theme"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>

        {isAuthenticated ? (
          <>
            {/* User chip */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded bg-surface-2 mt-1">
              <Avatar username={user.username} size="sm" />
              <span className="text-sm font-medium text-text-primary truncate flex-1">
                {user.username}
              </span>
            </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm text-text-secondary hover:text-error hover:bg-error/5 transition-colors w-full text-left"
            >
              <LogoutIcon />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-1 mt-1">
            <NavLink
              to="/login"
              className="px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              Log in
            </NavLink>
            <NavLink
              to="/register"
              className="px-3 py-2 rounded text-sm font-medium text-accent hover:bg-accent/8 transition-colors"
            >
              Sign up
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  )
}

function SidebarLink({ to, end, label, icon }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors',
          isActive
            ? 'bg-accent/10 text-accent font-medium'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 9A6 6 0 017 2.5a6 6 0 100 11 6 6 0 006.5-4.5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10.5 11l3-3-3-3M13.5 8H6"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
