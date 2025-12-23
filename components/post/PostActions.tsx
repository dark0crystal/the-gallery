'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'

export default function PostActions({
  postId,
  initialLiked = false,
  initialLikesCount = 0,
  initialSaved = false,
}: {
  postId: string
  initialLiked?: boolean
  initialLikesCount?: number
  initialSaved?: boolean
}) {
  const router = useRouter()
  const { success, error } = useToast()
  const [liked, setLiked] = useState(initialLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [saved, setSaved] = useState(initialSaved)
  const [loadingLike, setLoadingLike] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)

  const handleLike = async () => {
    if (loadingLike) return
    setLoadingLike(true)
    const optimistic = !liked
    setLiked(optimistic)
    setLikesCount((c) => c + (optimistic ? 1 : -1))

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
      if (res.status === 401) {
        router.push('/auth/signin')
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to like')
      // sync with server value if returned
      if (typeof data.liked === 'boolean') setLiked(data.liked)
      if (typeof data.likesCount === 'number') setLikesCount(data.likesCount)
      success(data.message || (data.liked ? 'Liked' : 'Unliked'))
    } catch (err) {
      // revert optimistic
      setLiked(!optimistic)
      setLikesCount((c) => c + (optimistic ? -1 : 1))
      error((err as Error).message || 'Failed to update like')
    } finally {
      setLoadingLike(false)
    }
  }

  const handleSave = async () => {
    if (loadingSave) return
    setLoadingSave(true)
    const optimistic = !saved
    setSaved(optimistic)

    try {
      const res = await fetch(`/api/posts/${postId}/save`, { method: 'POST' })
      if (res.status === 401) {
        router.push('/auth/signin')
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save')
      setSaved(Boolean(data.saved))
      success(data.message || (data.saved ? 'Saved' : 'Removed from saved'))
    } catch (err) {
      setSaved(!optimistic)
      error((err as Error).message || 'Failed to update saved')
    } finally {
      setLoadingSave(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        aria-pressed={liked}
        onClick={handleLike}
        disabled={loadingLike}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
          liked ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-800'
        } disabled:opacity-50`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
        </svg>
        <span>{likesCount}</span>
      </button>

      <button
        onClick={handleSave}
        disabled={loadingSave}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
          saved ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
        } disabled:opacity-50`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 5v14l7-4 7 4V5z" />
        </svg>
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button>

      <button
        onClick={() => {
          const url = window.location.href
          navigator.clipboard.writeText(url)
            .then(() => success('Link copied to clipboard'))
            .catch(() => error('Failed to copy link'))
        }}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium bg-gray-100 text-gray-800"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 17l8-8M16 17V9H8" />
        </svg>
        <span>Share</span>
      </button>
    </div>
  )
}
