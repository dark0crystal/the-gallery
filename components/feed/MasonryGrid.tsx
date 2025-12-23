'use client'

import React from 'react'
import { Post } from '@/types/post'
import { PinCard } from './PinCard'

interface MasonryGridProps {
    posts: Post[]
}

export function MasonryGrid({ posts }: MasonryGridProps) {
    if (!posts || posts.length === 0) {
        return (
            <div className="w-full text-center py-20 text-gray-500">
                No pins yet. Be the first to upload!
            </div>
        )
    }

    return (
        <div className="wrapper w-full px-2 sm:px-4 md:px-8">
            {/* 
         Tailwind 'columns' utility creates the Masonry layout.
         'gap-4' creates space between columns.
         'space-y-4' creates space between items in the vertical stack.
       */}
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 mx-auto max-w-[1800px]">
                {posts.map((post) => (
                    <PinCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}
