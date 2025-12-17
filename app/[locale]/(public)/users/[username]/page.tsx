import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-6 mb-8">
        {user.image && (
          <img
            src={user.image}
            alt={user.name || user.username || 'User'}
            className="w-24 h-24 rounded-full"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
          {user.username && <p className="text-gray-500">@{user.username}</p>}
          {user.bio && <p className="mt-2">{user.bio}</p>}
        </div>
      </div>
      <div className="flex gap-6 mb-8">
        <div>
          <span className="font-bold">{user._count.posts}</span> posts
        </div>
        <div>
          <span className="font-bold">{user._count.followers}</span> followers
        </div>
        <div>
          <span className="font-bold">{user._count.following}</span> following
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {user.posts.map((post) => (
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
  )
}

