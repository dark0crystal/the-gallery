import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EditPostForm } from './edit-post-form'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      categories: true,
    },
  })

  if (!post) {
    redirect('/')
  }

  if (post.userId !== session.user.id) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  )
}

