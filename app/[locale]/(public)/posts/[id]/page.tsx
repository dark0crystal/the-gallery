import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { CategoryBadge } from '@/components/category-badge'
import PostDetailClient from './PostDetailClient'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      location: true,
      images: {
        orderBy: { order: 'asc' },
      },
      categories: true,
      likes: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!post) {
    notFound()
  }

  // Make post fully serializable for client components
  const serializable = JSON.parse(JSON.stringify(post))

  return (
    <div>
      {/* Client-side interactive wrapper */}
      {/* @ts-expect-error Server -> Client prop */}
      <PostDetailClient post={serializable} />
    </div>
  )
}

