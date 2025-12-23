import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { CreatePostForm } from './create-post-form'
import { getTranslations } from 'next-intl/server'

export default async function CreatePostPage() {
  const session = await auth()
  const t = await getTranslations('post')
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('newPost')}</h1>
        <p className="text-gray-600 mb-8">Share your moments with the community</p>
        <CreatePostForm />
      </div>
    </div>
  )
}

