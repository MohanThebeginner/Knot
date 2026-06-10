import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageSpinner } from '@/components/ui/Spinner'

/**
 * Wraps routes that require authentication.
 * Preserves the intended destination so we can redirect after login.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

/**
 * Wraps routes that should NOT be accessible when logged in.
 * (login, register — redirect to home if already authenticated)
 */
export function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <PageSpinner />

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
