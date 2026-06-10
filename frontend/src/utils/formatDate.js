/**
 * Return a relative time string.
 * e.g. "just now", "3 minutes ago", "2 days ago"
 */
export function timeAgo(dateString) {
  const date = new Date(dateString)
  const now  = new Date()
  const diff = Math.floor((now - date) / 1000) // seconds

  if (diff < 60)            return 'just now'
  if (diff < 3600)          return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)         return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800)        return `${Math.floor(diff / 86400)}d ago`
  if (diff < 2592000)       return `${Math.floor(diff / 604800)}w ago`

  return formatDate(dateString)
}

/**
 * Return a formatted date string.
 * e.g. "Jun 12, 2024"
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  })
}

/**
 * Return a full date + time string.
 * e.g. "Jun 12, 2024 at 3:45 PM"
 */
export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   'numeric',
    minute: '2-digit',
  })
}
