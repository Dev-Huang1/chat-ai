'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { pusherClient } from '../lib/pusher'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data)
        setUnreadCount(data.filter((n: any) => !n.read).length)
      })

    const channel = pusherClient.subscribe('private-notifications')
    channel.bind('new-notification', (newNotification: any) => {
      setNotifications(prevNotifications => [newNotification, ...prevNotifications])
      setUnreadCount(prevCount => prevCount + 1)
    })

    return () => {
      pusherClient.unsubscribe('private-notifications')
    }
  }, [])

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PUT' })
    setNotifications(notifications.map((n: any) => n._id === id ? { ...n, read: true } : n))
    setUnreadCount(prevCount => prevCount - 1)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {notifications.map((notification: any) => (
          <DropdownMenuItem key={notification._id} onClick={() => markAsRead(notification._id)}>
            {notification.type === 'like' && `${notification.sender.username} liked your post`}
            {notification.type === 'comment' && `${notification.sender.username} commented on your post`}
            {notification.type === 'follow' && `${notification.sender.username} followed you`}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

