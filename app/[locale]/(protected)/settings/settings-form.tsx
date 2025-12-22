'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { User } from '@prisma/client'

export function SettingsForm({ user }: { user: User }) {
  const t = useTranslations('common')
  const router = useRouter()
  const [username, setUsername] = useState(user.username || '')
  const [bio, setBio] = useState(user.bio || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(user.image || null)
  const [coverPreview, setCoverPreview] = useState<string | null>(user.coverImage || null)

  const uploadFile = async (file: File) => {
    const fd = new FormData()
    fd.append('files', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data.imageUrls[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      let imageUrl = user.image
      let coverUrl = user.coverImage

      if (profileFile) {
        imageUrl = await uploadFile(profileFile)
      }

      if (coverFile) {
        coverUrl = await uploadFile(coverFile)
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          bio,
          image: imageUrl,
          coverImage: coverUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update settings')
      }

      setMessage({ type: 'success', text: t('settingsUpdated') })
      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : t('settingsUpdateFailed'),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('username')}
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('usernamePlaceholder')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('usernameHint')}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('bio')}
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder={t('bioPlaceholder')}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
        <div className="mt-1 flex justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('bioHint')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {bio.length}/500
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('coverImage') || 'Cover Image'}</label>
        {coverPreview && (
          <div className="mb-2">
            <img src={coverPreview} alt="Cover preview" className="w-full h-40 object-cover rounded-md" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] || null
            setCoverFile(f)
            if (f) setCoverPreview(URL.createObjectURL(f))
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image</label>
        {profilePreview && (
          <div className="mb-2">
            <img src={profilePreview} alt="Profile preview" className="w-24 h-24 object-cover rounded-full" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] || null
            setProfileFile(f)
            if (f) setProfilePreview(URL.createObjectURL(f))
          }}
        />
      </div>

      <div className="flex gap-3 pt-4">
      <button
        type="submit"
        disabled={saving}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('saving')}
            </span>
          ) : (
            t('save')
          )}
      </button>
      </div>
    </form>
  )
}

