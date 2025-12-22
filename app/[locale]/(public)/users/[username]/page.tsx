import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import ProfileHeader from '@/components/ProfileHeader'

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

  const session = await auth()
  let isFollowing = false
  if (session?.user) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id!,
          followingId: user.id,
        },
      },
    })
    isFollowing = !!follow
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProfileHeader user={user} isOwner={session?.user?.id === user.id} initialFollowing={isFollowing} />

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

