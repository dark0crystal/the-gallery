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

    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}

