'use client'

import Link from 'next/link'
import { useState } from 'react'
import FollowButton from './FollowButton'
import { useTranslations } from 'next-intl'

export default function ProfileHeader({
  user,
  isOwner = false,
  initialFollowing = false,
  onFollowToggle,
}: {
  user: {
    id: string
    name?: string | null
    username?: string | null
    image?: string | null
    coverImage?: string | null
    bio?: string | null
    _count?: { followers?: number; following?: number; posts?: number }
  }
  isOwner?: boolean
  initialFollowing?: boolean
  onFollowToggle?: (following: boolean) => void
}) {
  const t = useTranslations('common')
  const [followersCount, setFollowersCount] = useState<number>(user._count?.followers || 0)

  const handleToggle = (following: boolean) => {
    setFollowersCount((c) => c + (following ? 1 : -1))
    if (onFollowToggle) onFollowToggle(following)
  }

  return (
    <div className="mb-8">
      {user.coverImage ? (
        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-4">
          <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-40 bg-gray-100 rounded-lg mb-4" />
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img src={user.image} alt={user.name || user.username || 'User'} className="w-24 h-24 rounded-full" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
              {(user.name || user.username || 'U')[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
            {user.username && <p className="text-gray-500">@{user.username}</p>}
            {user.bio && <p className="mt-2">{user.bio}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOwner ? (
            <Link href={`/settings`} className="px-4 py-2 bg-gray-200 rounded-lg">
              {t('editProfile')}
            </Link>
          ) : (
            <FollowButton userId={user.id} initialFollowing={initialFollowing} onToggle={handleToggle} />
          )}
        </div>
      </div>

      <div className="flex gap-6 mt-4">
        <div>
          <span className="font-bold">{user._count?.posts || 0}</span> {t('posts')}
        </div>
        <div>
          <span className="font-bold">{followersCount}</span> {t('followers')}
        </div>
        <div>
          <span className="font-bold">{user._count?.following || 0}</span> {t('following')}
        </div>
      </div>
    </div>
  )
}
