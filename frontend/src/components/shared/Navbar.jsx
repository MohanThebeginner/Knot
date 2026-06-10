import { Link } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'

export function Navbar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="md:hidden sticky top-0 z-20 bg-bg border-b border-border flex items-center justify-between px-4 h-12">
      <Link
        to="/"
        className="flex items-center"
      >
        <img src={isDark ? '/brandD.png' : '/brand.png'} alt="Logo" className="h-8 w-auto" />
      </Link>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  )
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <circle cx="8.5" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.5 1.5v2M8.5 13.5v2M1.5 8.5h2M13.5 8.5h2M3.44 3.44l1.41 1.41M12.15 12.15l1.41 1.41M3.44 13.56l1.41-1.41M12.15 4.85l1.41-1.41"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M14 9.5A6 6 0 017.5 3a6 6 0 100 11A6 6 0 0014 9.5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
