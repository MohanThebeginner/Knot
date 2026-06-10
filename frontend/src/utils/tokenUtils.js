import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'pillar_token'
const USER_KEY  = 'pillar_user'

/**
 * Persist token to localStorage.
 */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Retrieve token from localStorage.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Remove token from localStorage.
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Decode a JWT and return its payload.
 * Returns null if the token is invalid or expired.
 */
export function decodeToken(token) {
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

/**
 * Check if a token is still valid (not expired).
 */
export function isTokenValid(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return false
  return decoded.exp * 1000 > Date.now()
}

/**
 * Persist minimal user info to localStorage.
 * We store { _id, username } because /login returns only { token }.
 */
export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Retrieve persisted user object.
 */
export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Remove user from localStorage.
 */
export function removeUser() {
  localStorage.removeItem(USER_KEY)
}

/**
 * Clear all auth data from localStorage.
 */
export function clearAuth() {
  removeToken()
  removeUser()
}
