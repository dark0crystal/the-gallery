'use client'

import React, { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

export default function NotificationBadge() {
  const [count, setCount] = useState<number>(0)

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/notifications?unreadOnly=true&limit=100')
      if (!res.ok) return
      const data = await res.json()
      setCount((data.notifications || []).length)
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
    fetchCount()
    const id = setInterval(fetchCount, 30000)
    return () => clearInterval(id)
  }, [])

  const display = count > 99 ? '99+' : String(count)

  return (
    <Link href="/notifications" className="relative inline-flex items-center px-2 py-1 hover:bg-emerald-50 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200" aria-label={`Notifications, ${count} unread`}>
      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">{display}</span>
      )}
    </Link>
  )
}
