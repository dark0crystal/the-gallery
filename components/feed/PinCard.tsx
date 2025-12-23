'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/types/post'

interface PinCardProps {
    post: Post
}

export function PinCard({ post }: PinCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isSaved, setIsSaved] = useState(post.isSaved || false)

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Optimistic update
        const previousState = isSaved
        setIsSaved(!previousState)

        try {
            const res = await fetch(`/api/posts/${post.id}/save`, { method: 'POST' })
            if (!res.ok) {
                if (res.status === 401) {
                    // Redirect to login or show modal
                    window.location.href = '/api/auth/signin' // Simple redirect for now
                }
                setIsSaved(previousState) // Revert
            }
        } catch (error) {
            console.error(error)
            setIsSaved(previousState)
        }
    }

    const primaryImage = post.images[0]?.imageUrl || '/placeholder.png'

    // Calculate aspect ratio for inline style to prevent layout shift if width/height known
    const aspectRatio = post.images[0]?.width && post.images[0]?.height
        ? { aspectRatio: `${post.images[0].width} / ${post.images[0].height}` }
        : {}

    return (
        <div
            className="relative mb-4 break-inside-avoid rounded-2xl cursor-zoom-in group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden rounded-2xl">
                {/* Image */}
                <img
                    src={primaryImage}
                    alt={post.title || 'Pin'}
                    className="w-full object-cover rounded-2xl"
                    style={aspectRatio}
                    loading="lazy"
                />

                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                {/* Save Button (Top Right) */}
                <div className={`absolute top-3 right-3 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 rounded-full font-bold text-base transition-colors ${isSaved
                            ? 'bg-black text-white hover:bg-black/80'
                            : 'bg-[#E60023] text-white hover:bg-[#ad081b]'
                            }`}
                    >
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>

                {/* Bottom Actions (Share/More) */}
                <div className={`absolute bottom-3 right-3 flex gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full backdrop-blur-sm transition-colors text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                    </button>
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full backdrop-blur-sm transition-colors text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                        </svg>
                    </button>
                </div>

                {/* Link Overlay (Bottom Left) - Optional source link */}
                {/* <div className={`absolute bottom-3 left-3 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold truncate max-w-[120px] transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          src.com
        </div> */}
            </div>

            {/* Caption / User Info (Below Image) */}
            <div className="mt-2 pl-1">
                {post.title && <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{post.title}</h3>}

                <div className="flex items-center gap-2 mt-1">
                    {post.user.image && (
                        <img src={post.user.image} alt={post.user.name || 'User'} className="w-6 h-6 rounded-full object-cover" />
                    )}
                    <span className="text-xs text-gray-700">{post.user.name || post.user.username}</span>
                </div>
            </div>
        </div>
    )
}
