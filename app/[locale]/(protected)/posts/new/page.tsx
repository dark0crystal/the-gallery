import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { CreatePostForm } from './create-post-form'

export default async function CreatePostPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create Post</h1>
      <CreatePostForm />
    </div>
  )
}

