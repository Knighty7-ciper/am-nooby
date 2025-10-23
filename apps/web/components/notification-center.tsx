'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  AtSign,
  BookOpen,
  Mail,
  Check,
  Trash2,
  Filter
} from 'lucide-react'
import Link from 'next/link'

const typeIcons = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  MENTION: AtSign,
  REPLY: MessageCircle,
  POST_PUBLISHED: BookOpen,
  NEWSLETTER: Mail,
}

const typeColors = {
  LIKE: 'text-red-500',
  COMMENT: 'text-blue-500',
  FOLLOW: 'text-green-500',
  MENTION: 'text-purple-500',
  REPLY: 'text-indigo-500',
  POST_PUBLISHED: 'text-orange-500',
  NEWSLETTER: 'text-cyan-500',
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter)

  const unreadCount = notifications.filter(n => !n.read).length

  const formatTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diff = now.getTime() - then.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return then.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-500" />
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread
              </Button>
              <Button
                variant={filter === 'LIKE' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('LIKE')}
              >
                Likes
              </Button>
              <Button
                variant={filter === 'COMMENT' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('COMMENT')}
              >
                Comments
              </Button>
              <Button
                variant={filter === 'FOLLOW' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('FOLLOW')}
              >
                Follows
              </Button>
            </div>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {loading ? (
            <Card className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading notifications...</p>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'unread' ? "You're all caught up!" : 'Check back later for updates'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map(notification => {
              const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Bell
              const iconColor = typeColors[notification.type as keyof typeof typeColors] || 'text-gray-500'

              return (
                <Card
                  key={notification.id}
                  className={`p-4 transition-all hover:shadow-md ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.read && (
                          <Badge variant="default" className="shrink-0">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatTime(notification.createdAt)}</span>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="text-primary hover:underline"
                            onClick={() => !notification.read && markAsRead(notification.id)}
                          >
                            View
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-primary hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-500 hover:underline ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
