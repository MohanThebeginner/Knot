import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { notificationService } from '@/services/notificationService'
import io from 'socket.io-client'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(false)

  // Initialize socket.io connection
  useEffect(() => {
    if (!user) return

    const socketURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    console.log('Connecting to socket server:', socketURL)

    const socketInstance = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id)
      // Register user with socket
      socketInstance.emit('register', user._id)
    })

    socketInstance.on('notification', (data) => {
      console.log('New notification received:', data)
      // Add notification to the list
      setNotifications(prev => [data.notification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user])

  // Fetch notifications on mount and when user changes
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await notificationService.getNotifications()
      setNotifications(data)

      const countData = await notificationService.getUnreadCount()
      setUnreadCount(countData.count)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchNotifications()
  }, [user, fetchNotifications])

  const markAsRead = useCallback(async () => {
    try {
      await notificationService.markAsRead()
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        fetchNotifications,
        socket,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx)
    throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
