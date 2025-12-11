'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { CategorySelector } from '@/components/category-selector'
import { useTranslations } from 'next-intl'

export function CreatePostForm() {
  const router = useRouter()
  const t = useTranslations('category')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [locationId, setLocationId] = useState('')
  const [categoryIds, setCategoryIds] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Upload images
      const formData = new FormData()
      images.forEach((file) => {
        formData.append('files', file)
      })

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload images')
      }

      const { imageUrls } = await uploadResponse.json()

      // Create post
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          locationId,
          imageUrls,
          categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        }),
      })

      if (!postResponse.ok) {
        throw new Error('Failed to create post')
      }

      const post = await postResponse.json()
      router.push(`/posts/${post.id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setUploading(false)
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
        <label className="block text-sm font-medium mb-2">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {images.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            {images.length} image(s) selected
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <input
          type="text"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          placeholder="Location ID (will be integrated with Google Maps)"
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
      <button
        type="submit"
        disabled={uploading || images.length === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Publishing...' : 'Publish'}
      </button>
    </form>
  )
}

