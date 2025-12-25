'use client'

import React, { useState, useMemo } from 'react'
import NotificationItem from './NotificationItem'
import { useToast } from '@/hooks/useToast'

export default function NotificationList({ initial = [] }: { initial?: any[] }) {
  const [items, setItems] = useState(initial)
  const { success, error } = useToast()

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items])

  const markRead = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)))
  }

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'POST' })
      if (!res.ok) throw new Error('Failed')
      setItems((prev) => prev.map((i) => ({ ...i, read: true })))
      success('Marked all as read')
    } catch (err) {
      console.error(err)
      error('Failed to mark all as read')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && <span className="text-sm text-gray-600">{unreadCount} unread</span>}
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={`text-sm px-3 py-1 rounded-md transition ${unreadCount > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="p-8 bg-white rounded-lg text-center text-sm text-gray-500 shadow-sm">
            <div className="mb-2 text-gray-400">No notifications yet</div>
            <div className="text-xs text-gray-400">Activities such as likes, comments and follows will appear here.</div>
          </div>
        )}

        <ul className="space-y-2" role="list">
          {items.map((n) => (
            <li key={n.id}>
              <NotificationItem notification={n} onMarkRead={markRead} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
