import { redirect } from '@/i18n/navigation'
import { requireAdmin } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

export default async function AdminModerationPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Content Moderation (Admin)</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{post.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-500">
                  By: {post.user.name || post.user.username}
                </p>
                <p className="text-sm text-gray-500">
                  {post._count.likes} likes, {post._count.comments} comments
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                  Hide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

