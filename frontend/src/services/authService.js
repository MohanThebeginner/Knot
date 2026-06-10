import api from './api'

export const authService = {
  /**
   * POST /login
   * @returns {{ token: string }}
   */
  async login({ username, password }) {
    const res = await api.post('/login', { username, password })
    return res.data
  },

  /**
   * POST /signup
   * @returns {{ message: string }}
   */
  async register({ username, password, email }) {
    const res = await api.post('/signup', { username, password, email })
    return res.data
  },

  /**
   * GET /verify?token=...
   * @returns {{ message: string }}
   */
  async verifyEmail(token) {
    const res = await api.get('/verify', { params: { token } })
    return res.data
  },
}
