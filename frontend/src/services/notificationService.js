import api from './api'

export const notificationService = {
  // Get all notifications for the user
  getNotifications: async () => {
    const response = await api.get('/notifications')
    return response.data
  },

  // Mark all notifications as read
  markAsRead: async () => {
    const response = await api.patch('/notifications/read')
    return response.data
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count')
    return response.data
  }
}
