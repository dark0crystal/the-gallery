import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function FollowingPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id! },
    include: {
      following: {
        include: {
          following: {
            include: {
              posts: {
                include: {
                  images: {
                    orderBy: { order: 'asc' },
                    take: 1,
                  },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
              },
            },
          },
        },
      },
    },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Following</h1>
      <div className="space-y-6">
        {user.following.map((follow) => (
          <div key={follow.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold">
              {follow.following.name || follow.following.username}
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {follow.following.posts.map((post) => (
                <div key={post.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  {post.images[0] && (
                    <img
                      src={post.images[0].imageUrl}
                      alt={post.title || 'Post'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

