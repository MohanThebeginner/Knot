import { cn } from '@/utils/cn'

// Deterministic color from username string
function colorFromString(str = '') {
  const colors = [
    'bg-blue-500',   'bg-violet-500', 'bg-emerald-500',
    'bg-orange-500', 'bg-rose-500',   'bg-cyan-500',
    'bg-amber-500',  'bg-teal-500',   'bg-indigo-500',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function initials(name = '') {
  return name.charAt(0).toUpperCase() || '?'
}

const sizes = {
  xs: 'w-6  h-6  text-xs',
  sm: 'w-7  h-7  text-xs',
  md: 'w-8  h-8  text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-14 h-14 text-xl',
}

export function Avatar({ username, size = 'md', className }) {
  return (
    <span
      aria-label={username}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 select-none',
        colorFromString(username),
        sizes[size] || sizes.md,
        className
      )}
    >
      {initials(username)}
    </span>
  )
}
