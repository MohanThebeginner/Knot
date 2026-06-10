import axios from 'axios'
import { clearAuth, getToken } from '@/utils/tokenUtils'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor ─────────────────────────────────
// Attach JWT to every request that has a token in storage.
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ────────────────────────────────
// Normalize error shape. Components receive a plain Error with
// a human-readable message — never a raw Axios error object.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      // Token expired or invalid — force logout
      if (status === 401) {
        const isAuthRoute =
          error.config.url.includes('/login') ||
          error.config.url.includes('/signup')

        if (!isAuthRoute) {
          clearAuth()
          // Dispatch a custom event so AuthContext can react
          window.dispatchEvent(new Event('auth:expired'))
        }
      }

      // Extract the most useful error message from the backend response
      let message = 'Something went wrong'

      if (data?.error) {
        message = data.error
      } else if (data?.errors && Array.isArray(data.errors)) {
        // express-validator errors array
        message = data.errors.map(e => e.msg).join('. ')
      } else if (data?.message) {
        message = data.message
      }

      const err = new Error(message)
      err.status  = status
      err.data    = data
      return Promise.reject(err)
    }

    if (error.request) {
      return Promise.reject(new Error('No response from server. Check your connection.'))
    }

    return Promise.reject(error)
  }
)

export default api
