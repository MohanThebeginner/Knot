import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/authService'
import {
  clearAuth,
  decodeToken,
  getToken,
  getUser,
  isTokenValid,
  saveToken,
  saveUser,
} from '@/utils/tokenUtils'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(null)
  const [loading, setLoading] = useState(true) // true until we've checked localStorage

  // Rehydrate auth state from localStorage on mount
  useEffect(() => {
    const storedToken = getToken()
    const storedUser  = getUser()

    if (storedToken && isTokenValid(storedToken) && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    } else {
      // Token missing or expired — clean up
      clearAuth()
    }

    setLoading(false)
  }, [])

  const login = useCallback(async ({ username, password }) => {
    const data = await authService.login({ username, password })
    // data = { token }
    const { token: receivedToken } = data

    const decoded = decodeToken(receivedToken)
    const userData = { _id: decoded.id, username }

    saveToken(receivedToken)
    saveUser(userData)
    setToken(receivedToken)
    setUser(userData)

    return userData
  }, [])

  const register = useCallback(async ({ username, password, email }) => {
    // Backend returns { message } only — no token on signup
    await authService.register({ username, password, email })
    // Return the username so the login page can pre-fill it
    return { username }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setToken(null)
    setUser(null)
  }, [])

  /**
   * Check if the authenticated user owns a resource.
   * Compares user._id against a resource's author._id string.
   */
  const isOwner = useCallback((authorId) => {
    if (!user) return false
    return user._id === authorId || user._id === String(authorId)
  }, [user])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    isOwner,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
