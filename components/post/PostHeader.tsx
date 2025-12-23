'use client'

import React from 'react'
import Image from 'next/image'
import FollowButton from '@/components/FollowButton'

export default function PostHeader({
  user,
  createdAt,
  location,
  initialFollowing = false,
}: {
  user: { id: string; name?: string; username?: string; image?: string }
  createdAt?: string
  location?: { id: string; name?: string }
  initialFollowing?: boolean
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
          {user.image && <Image src={user.image} alt={user.username || user.name || 'Avatar'} width={64} height={64} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{user.name || user.username}</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </div>
            <FollowButton userId={user.id} initialFollowing={initialFollowing} />
          </div>
          <div className="mt-3 text-sm text-gray-500">
            {createdAt && <span>Posted {new Date(createdAt).toLocaleDateString()}</span>}
            {location && <span className="ml-3">• {location.name}</span>} 
          </div>
        </div>
      </div>
    </div>
  )
}
