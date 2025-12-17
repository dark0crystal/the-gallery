import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { CategoryBadge } from '@/components/category-badge'

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{post.title || 'Untitled Post'}</h1>
      {post.description && (
        <p className="text-gray-600 mb-6">{post.description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {post.images.map((image) => (
          <Image
            key={image.id}
            src={image.imageUrl}
            alt={image.altText || post.title || 'Post image'}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        ))}
      </div>
      {post.categories && post.categories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <CategoryBadge key={category.id} category={category} />
            ))}
          </div>
        </div>
      )}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-500">
          Location: {post.location.name}
        </p>
        <p className="text-sm text-gray-500">
          By: {post.user.name || post.user.username}
        </p>
      </div>
    </div>
  )
}

