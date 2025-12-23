import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCache, setCache, deleteCache, CACHE_TTL } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const locationId = searchParams.get('locationId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const cursor = searchParams.get('cursor') // Cursor-based pagination

    // Cache key needs to include cursor
    const cacheKey = `posts:${userId || 'all'}:${locationId || 'all'}:${limit}:${cursor || 'start'}`

    // Note: Caching with personalization (likedByMe) is tricky. 
    // For now, we might skip caching or cache the public data and merge personal data.
    // To keep it simple for this prototype, checking DB directly if session exists for personal status.

    const where: any = { isPublic: true }
    if (userId) where.userId = userId
    if (locationId) where.locationId = locationId

    const posts = await prisma.post.findMany({
      where,
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
        _count: {
          select: {
            likes: true,
            comments: true,
            saves: true,
          },
        },
        // We'll fetch liked/saved status manually or via subqueries if Prisma supports it cleanly,
        // but explicit relation check is easier for now.
        likes: session?.user?.id ? { where: { userId: session.user.id } } : false,
        saves: session?.user?.id ? { where: { userId: session.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // Fetch one extra to determine next cursor
      cursor: cursor ? { id: cursor } : undefined,
    })

    let nextCursor: string | undefined = undefined
    if (posts.length > limit) {
      const nextItem = posts.pop() // Remove the extra item
      nextCursor = nextItem?.id
    }

    // Transform data to include simple boolean flags
    const formattedPosts = posts.map(post => ({
      ...post,
      isLiked: post.likes?.length > 0,
      isSaved: post.saves?.length > 0,
      likes: undefined, // Remove the raw rel array
      saves: undefined,
    }))

    return NextResponse.json({
      data: formattedPosts,
      nextCursor,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    // images: array of { url, width, height }
    const { title, description, locationId, images, isPublic = true, categoryIds = [] } = body

    if (!locationId || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Location and at least one image are required' },
        { status: 400 }
      )
    }

    // Validate categoryIds if provided
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const categories = await prisma.category.findMany({
        where: {
          id: { in: categoryIds },
        },
      })

      if (categories.length !== categoryIds.length) {
        return NextResponse.json(
          { error: 'One or more categories not found' },
          { status: 400 }
        )
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        locationId,
        userId: session.user.id!,
        isPublic,
        images: {
          create: images.map((img: any, index: number) => ({
            imageUrl: typeof img === 'string' ? img : img.url,
            width: typeof img === 'object' ? img.width : null,
            height: typeof img === 'object' ? img.height : null,
            order: index,
          })),
        },
        categories: categoryIds && categoryIds.length > 0 ? {
          connect: categoryIds.map((id: string) => ({ id })),
        } : undefined,
      },
      include: {
        user: true,
        location: true,
        images: true,
        categories: true,
      },
    })

    // Invalidate cache
    await Promise.all([
      deleteCache(`feed:${session.user.id}`),
    ])

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
