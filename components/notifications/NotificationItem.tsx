'use client'

import React from 'react'
import Image from 'next/image'
import { useToast } from '@/hooks/useToast'

type NotificationLike = {
  id: string
  type: string
  read?: boolean
  createdAt: string
  relatedUser?: { id: string; name?: string; username?: string; image?: string }
  relatedPost?: { id: string; title?: string }
}

function timeAgo(iso: string) {
  const d = new Date(iso)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return d.toLocaleDateString()
}

function Icon({ type }: { type: string }) {
  switch (type) {
    case 'LIKE':
      return (
        <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 21s-7-4.35-9-7.15C-1.5 9.9 3 3 8 5c2.3 1 4 3.5 4 3.5s1.7-2.5 4-3.5c5-2 9.5 4.9 5 8.85C19 16.65 12 21 12 21z" />
        </svg>
      )
    case 'COMMENT':
      return (
        <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
        </svg>
      )
    case 'FOLLOW':
      return (
        <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />
        </svg>
      )
    default:
      return (
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      )
  }
}

export default function NotificationItem({ notification, onMarkRead }: { notification: NotificationLike; onMarkRead: (id: string) => void }) {
  const { success, error } = useToast()

  const actor = notification.relatedUser

  const text = (() => {
    switch (notification.type) {
      case 'LIKE':
        return <span><strong>{actor?.name || actor?.username || 'Someone'}</strong> liked your post</span>
      case 'COMMENT':
        return <span><strong>{actor?.name || actor?.username || 'Someone'}</strong> commented on your post</span>
      case 'FOLLOW':
        return <span><strong>{actor?.name || actor?.username || 'Someone'}</strong> started following you</span>
      case 'MENTION':
        return <span><strong>{actor?.name || actor?.username || 'Someone'}</strong> mentioned you</span>
      default:
        return <span>Activity</span>
    }
  })()

  const handleClick = async () => {
    try {
      if (!notification.read) {
        await fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' })
        onMarkRead(notification.id)
      }
      if (notification.relatedPost?.id) {
        window.location.href = `/posts/${notification.relatedPost.id}`
      } else if (notification.relatedUser?.id) {
        window.location.href = `/users/${notification.relatedUser.username || notification.relatedUser.id}`
      }
    } catch (err) {
      console.error(err)
      error('Failed to open notification')
    }
  }

  const handleMarkRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (!notification.read) {
        const res = await fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' })
        if (!res.ok) throw new Error('Failed')
        onMarkRead(notification.id)
        success('Marked as read')
      }
    } catch (err) {
      console.error(err)
      error('Could not mark as read')
    }
  }

  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
      className={`flex gap-4 items-start p-4 bg-white rounded-lg shadow-sm transition hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${notification.read ? '' : 'border-l-4 border-emerald-500'}`}
      aria-pressed={notification.read}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
        {notification.relatedUser?.image ? (
          <Image src={notification.relatedUser.image} alt={notification.relatedUser.name || notification.relatedUser.username || 'User'} width={48} height={48} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-700">{(notification.relatedUser?.name || notification.relatedUser?.username || 'U')[0]?.toUpperCase()}</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-800 min-w-0">
            <span className="flex items-center gap-2 shrink-0"><Icon type={notification.type} />{text}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</div>
            {!notification.read && (
              <button
                onClick={handleMarkRead}
                className="text-xs text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-200 px-2 py-1 rounded transition"
                aria-label="Mark notification as read"
                title="Mark as read"
              >
                Mark
              </button>
            )}
          </div>
        </div>

        {notification.relatedPost?.title && <div className="text-xs text-gray-500 mt-2 truncate">{notification.relatedPost.title}</div>}
      </div>
    </div>
  )
}
