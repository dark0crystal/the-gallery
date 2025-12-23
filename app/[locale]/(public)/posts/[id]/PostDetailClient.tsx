'use client'

import React from 'react'
import ImageGallery from '@/components/post/ImageGallery'
import PostActions from '@/components/post/PostActions'
import CommentsSection from '@/components/post/CommentsSection'
import PostHeader from '@/components/post/PostHeader'
import { CategoryBadge } from '@/components/category-badge'

type ImageType = { id: string; imageUrl: string; altText?: string }

type PostType = {
  id: string
  title?: string
  description?: string
  images: ImageType[]
  liked?: boolean
  likes?: unknown[]
  saved?: boolean
  user: { id: string; name?: string; username?: string; image?: string }
  createdAt?: string
  location?: { id: string; name?: string }
  categories?: { id: string; name: string }[]
  comments?: unknown[]
}

export default function PostDetailClient({ post }: { post: PostType }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-2">
          <ImageGallery images={post.images.map((i: ImageType) => ({ id: i.id, imageUrl: i.imageUrl, altText: i.altText }))} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">{post.title || 'Untitled post'}</h1>
            <p className="text-sm text-gray-600 mb-3">{post.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <PostActions postId={post.id} initialLiked={Boolean(post.liked)} initialLikesCount={post.likes?.length ?? 0} initialSaved={Boolean(post.saved)} />
              </div>
            </div>
          </div>

          <PostHeader user={post.user} createdAt={post.createdAt} location={post.location} />

          {post.categories && post.categories.length > 0 && (
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {post.categories?.map((c) => (
                  <CategoryBadge key={c.id} category={c} />
                ))}
              </div>
            </div>
          )}

          <CommentsSection postId={post.id} initialComments={(post.comments ?? []) as import('@/components/post/CommentsSection').CommentType[]} />
        </div>
      </div>

      {/* Related posts placeholder - optional enhancement */}
      <div className="mt-8">
        {/* Could render RelatedPosts component here */}
      </div>
    </div>
  )
}
