'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function FollowButton({
  userId,
  initialFollowing = false,
  onToggle,
}: {
  userId: string
  initialFollowing?: boolean
  onToggle?: (following: boolean) => void
}) {
  const t = useTranslations('user')
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users/${userId}/follow`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setFollowing(Boolean(data.following))
      if (onToggle) onToggle(Boolean(data.following))
    } catch (error) {
      console.error('Follow toggle failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        following
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? t('loading') : following ? t('unfollow') : t('follow')}
    </button>
  )
}
