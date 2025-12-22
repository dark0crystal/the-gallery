import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cacheKeys, deleteCache } from '@/lib/cache'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (id === session.user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id!,
          followingId: id,
        },
      },
    })

    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      })

      await deleteCache(cacheKeys.followers(id))
      await deleteCache(cacheKeys.following(session.user.id!))

      return NextResponse.json({ following: false })
    }

    await prisma.follow.create({
      data: {
        followerId: session.user.id!,
        followingId: id,
      },
    })

    await deleteCache(cacheKeys.followers(id))
    await deleteCache(cacheKeys.following(session.user.id!))

    return NextResponse.json({ following: true })
  } catch (error) {
    console.error('Error toggling follow:', error)
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 })
  }
}

