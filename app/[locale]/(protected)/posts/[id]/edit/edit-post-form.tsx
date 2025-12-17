'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Post, Image, Category } from '@prisma/client'
import { CategorySelector } from '@/components/category-selector'
import { useTranslations } from 'next-intl'

interface PostWithImages extends Post {
  images: Image[]
  categories?: Category[]
}

export function EditPostForm({ post }: { post: PostWithImages }) {
  const router = useRouter()
  const t = useTranslations('category')
  const [title, setTitle] = useState(post.title || '')
  const [description, setDescription] = useState(post.description || '')
  const [saving, setSaving] = useState(false)
  const [categoryIds, setCategoryIds] = useState<string[]>(
    post.categories?.map((cat) => cat.id) || []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          locationId: post.locationId,
          isPublic: post.isPublic,
          categoryIds: categoryIds.length > 0 ? categoryIds : [],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      router.push(`/posts/${post.id}`)
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">{t('selectCategories')}</label>
        <CategorySelector
          selectedCategoryIds={categoryIds}
          onChange={setCategoryIds}
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

