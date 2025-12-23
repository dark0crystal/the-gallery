'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { CategorySelector } from '@/components/category-selector'
import { ImageUpload } from '@/components/post/ImageUpload'
import { LocationSearch } from '@/components/post/LocationSearch'
import { FloatingLabelInput } from '@/components/post/FloatingLabelInput'
import { useTranslations } from 'next-intl'

interface ImageFile {
  file: File
  preview: string
  id: string
}

export function CreatePostForm() {
  const router = useRouter()
  const t = useTranslations('category')
  const tPost = useTranslations('post')
  const tCommon = useTranslations('common')
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<ImageFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [locationId, setLocationId] = useState('')
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [images])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (images.length === 0) {
      newErrors.images = 'At least one image is required'
    }
    
    if (!locationId) {
      newErrors.location = 'Location is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setUploading(true)
    setErrors({})

    try {
      // Upload images
      const formData = new FormData()
      images.forEach((imageFile) => {
        formData.append('files', imageFile.file)
      })

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Failed to upload images')
      }

      const { imageUrls } = await uploadResponse.json()

      // Create post
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || undefined,
          description: description || undefined,
          locationId,
          imageUrls,
          categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
          isPublic,
        }),
      })

      if (!postResponse.ok) {
        const errorData = await postResponse.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const post = await postResponse.json()
      
      // Show success message
      setShowSuccess(true)
      
      // Redirect after short delay
      setTimeout(() => {
        router.push(`/posts/${post.id}`)
      }, 1500)
    } catch (error) {
      console.error('Error creating post:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create post. Please try again.',
      })
    } finally {
      setUploading(false)
    }
  }

  const canPublish = images.length > 0 && locationId && !uploading

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Post published successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image Upload */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {tPost('uploadImages')}
              </h2>
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={10}
              />
              {errors.images && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.images}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              {/* Title */}
              <FloatingLabelInput
                id="title"
                label={tPost('title')}
                value={title}
                onChange={setTitle}
                placeholder="Give your post a title..."
                maxLength={100}
                error={errors.title}
              />

              {/* Description */}
              <FloatingLabelInput
                id="description"
                label={tPost('description')}
                value={description}
                onChange={setDescription}
                type="textarea"
                placeholder="Tell everyone what your post is about..."
                maxLength={500}
                rows={6}
                error={errors.description}
              />

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  {tPost('location')} <span className="text-red-500">*</span>
                </label>
                <LocationSearch
                  value={locationId}
                  onChange={setLocationId}
                  placeholder="Search for a location..."
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('selectCategories')}
                </label>
                <CategorySelector
                  selectedCategoryIds={categoryIds}
                  onChange={setCategoryIds}
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <label htmlFor="visibility" className="block text-sm font-medium text-gray-900 mb-1">
                    Visibility
                  </label>
                  <p className="text-xs text-gray-500">
                    {isPublic ? 'Anyone can see this post' : 'Only you can see this post'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${isPublic ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                  role="switch"
                  aria-checked={isPublic}
                  aria-label="Toggle post visibility"
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${isPublic ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700 mt-1">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Publish Button */}
        <div className="sticky bottom-0 mt-8 bg-white border-t border-gray-200 shadow-lg -mx-4 px-4 py-4 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              {tCommon('cancel')}
            </button>
            <button
              type="submit"
              disabled={!canPublish}
              className={`
                px-8 py-3 rounded-xl font-semibold text-white transition-all
                flex items-center gap-2 min-w-[140px] justify-center
                ${canPublish
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>{tPost('publish')}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
