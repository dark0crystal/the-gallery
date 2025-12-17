import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cacheKeys, getCache, setCache, deleteCache, CACHE_TTL } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const locationId = searchParams.get('locationId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const cacheKey = `posts:${userId || 'all'}:${locationId || 'all'}:${limit}:${offset}`
    const cached = await getCache(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    await setCache(cacheKey, posts, CACHE_TTL.POST_FEED)

    return NextResponse.json(posts)
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
    const { title, description, locationId, imageUrls, isPublic = true, categoryIds = [] } = body

    if (!locationId || !imageUrls || imageUrls.length === 0) {
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
          create: imageUrls.map((url: string, index: number) => ({
            imageUrl: url,
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
      deleteCache('posts:all:all:20:0'),
    ])

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

