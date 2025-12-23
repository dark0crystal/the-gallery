import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true'
    const limitParam = parseInt(url.searchParams.get('limit') || '50', 10)
    const limit = Math.min(Math.max(limitParam || 20, 1), 100)
    const cursor = url.searchParams.get('cursor')

    let cursorCreatedAt: Date | undefined

    if (cursor) {
      const c = await prisma.notification.findUnique({ where: { id: cursor }, select: { createdAt: true } })
      if (c) cursorCreatedAt = c.createdAt
    }

    const where: any = { userId: session.user.id }
    if (unreadOnly) where.read = false
    if (cursorCreatedAt) where.createdAt = { lt: cursorCreatedAt }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        relatedUser: { select: { id: true, name: true, username: true, image: true } },
        relatedPost: { select: { id: true, title: true } },
      },
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}