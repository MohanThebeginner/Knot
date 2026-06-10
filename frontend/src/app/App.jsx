import { ThemeProvider }  from '@/contexts/ThemeContext'
import { ToastProvider }  from '@/contexts/ToastContext'
import { AuthProvider }   from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { AppRouter }      from '@/routes'

/**
 * Provider order matters:
 * Theme  → sets up CSS variables (everything depends on this)
 * Toast  → global notifications (auth can fire toasts)
 * Auth   → user session (uses toast, reads theme-independent)
 * Notifications → depends on auth and socket.io
 * Router → everything else
 */
export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
