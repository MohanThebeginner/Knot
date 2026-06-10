import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from './ProtectedRoute'
import { PageSpinner } from '@/components/ui/Spinner'
import RootLayout from '@/layouts/RootLayout'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'

// Route-based code splitting
const HomePage        = lazy(() => import('@/pages/HomePage'))
const LoginPage       = lazy(() => import('@/pages/LoginPage'))
const RegisterPage    = lazy(() => import('@/pages/RegisterPage'))
const VerificationSentPage = lazy(() => import('@/pages/VerificationSentPage'))
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmailPage'))
const PostPage        = lazy(() => import('@/pages/PostPage'))
const CreatePostPage  = lazy(() => import('@/pages/CreatePostPage'))
const EditPostPage    = lazy(() => import('@/pages/EditPostPage'))
const ProfilePage     = lazy(() => import('@/pages/ProfilePage'))
const SettingsPage    = lazy(() => import('@/pages/SettingsPage'))
const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage'))

function Fallback() {
  return <PageSpinner />
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // ── App shell (sidebar + panels) ──────────────────────
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: (
              <Suspense fallback={<Fallback />}>
                <HomePage />
              </Suspense>
            ),
          },
          {
            path: '/posts/:id',
            element: (
              <Suspense fallback={<Fallback />}>
                <PostPage />
              </Suspense>
            ),
          },
          {
            path: '/posts/new',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<Fallback />}>
                  <CreatePostPage />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: '/posts/:id/edit',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<Fallback />}>
                  <EditPostPage />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: '/profile',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<Fallback />}>
                  <ProfilePage />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: '/settings',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<Fallback />}>
                  <SettingsPage />
                </Suspense>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // ── Auth shell (centered card) ─────────────────────────
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: (
              <GuestRoute>
                <Suspense fallback={<Fallback />}>
                  <LoginPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: '/register',
            element: (
              <GuestRoute>
                <Suspense fallback={<Fallback />}>
                  <RegisterPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: '/verification-sent',
            element: (
              <GuestRoute>
                <Suspense fallback={<Fallback />}>
                  <VerificationSentPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: '/verify',
            element: (
              <Suspense fallback={<Fallback />}>
                <VerifyEmailPage />
              </Suspense>
            ),
          },
        ],
      },

      // ── 404 ───────────────────────────────────────────────
      {
        path: '*',
        element: (
          <Suspense fallback={<Fallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
