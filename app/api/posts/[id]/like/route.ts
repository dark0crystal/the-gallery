import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id!,
          postId: id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      return NextResponse.json({ liked: false })
    }

    await prisma.like.create({
      data: {
        userId: session.user.id!,
        postId: id,
      },
    })

    // Create a notification for the post owner if it's not the actor
    try {
      const post = await prisma.post.findUnique({ where: { id }, select: { userId: true } })
      if (post && post.userId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: post.userId,
            type: 'LIKE',
            relatedUserId: session.user.id!,
            relatedPostId: id,
          },
        })
      }
    } catch (err) {
      console.error('Failed to create like notification', err)
    }

    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}

