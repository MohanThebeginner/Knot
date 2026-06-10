import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { ToastContainer } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

/**
 * Top-level layout. Wraps everything.
 * Handles global side effects: auth expiry events, etc.
 */
function AuthExpiredListener() {
  const { logout } = useAuth()
  const toast      = useToast()

  useEffect(() => {
    function handleExpired() {
      logout()
      toast.error('Your session has expired. Please log in again.')
    }
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [logout, toast])

  return null
}

export default function RootLayout() {
  return (
    <>
      <AuthExpiredListener />
      <Outlet />
      <ToastContainer />
    </>
  )
}
