'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Post } from '@/types/post'
import { MasonryGrid } from './MasonryGrid'
import { SkeletonPin } from './SkeletonPin'

export function Feed() {
    const [posts, setPosts] = useState<Post[]>([])
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const [initialLoaded, setInitialLoaded] = useState(false)

    const observerTarget = useRef<HTMLDivElement>(null)

    const fetchPosts = useCallback(async (cursor?: string) => {
        if (loading) return
        setLoading(true)

        try {
            const params = new URLSearchParams({ limit: '20' })
            if (cursor) params.append('cursor', cursor)

            const res = await fetch(`/api/posts?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch')

            const data = await res.json()
            // data: { data: Post[], nextCursor: string }

            setPosts(prev => {
                // Dedup logic just in case
                const newPosts = data.data.filter((p: Post) => !prev.some(existing => existing.id === p.id))
                return [...prev, ...newPosts]
            })
            setNextCursor(data.nextCursor)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setInitialLoaded(true)
        }
    }, [loading]) // be careful with deps

    // Initial load
    useEffect(() => {
        if (!initialLoaded) {
            fetchPosts()
        }
    }, [initialLoaded]) // eslint-disable-line

    // Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && nextCursor && !loading) {
                    fetchPosts(nextCursor)
                }
            },
            { threshold: 0.1 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [nextCursor, loading, fetchPosts])

    return (
        <div className="min-h-screen pb-20">
            <MasonryGrid posts={posts} />

            {/* Loading State / Skeletons */}
            {(loading || !initialLoaded) && (
                <div className="wrapper w-full px-2 sm:px-4 md:px-8 mt-4">
                    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 mx-auto max-w-[1800px]">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <SkeletonPin key={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* Observer Target */}
            <div ref={observerTarget} className="h-4 w-full" />

            {!loading && !nextCursor && posts.length > 0 && (
                <div className="text-center py-10 text-gray-500">
                    You're all caught up!
                </div>
            )}
        </div>
    )
}
