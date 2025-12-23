import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await prisma.notification.updateMany({ where: { userId: session.user.id, read: false }, data: { read: true } })
    return NextResponse.json({ success: true, count: result.count })
  } catch (error) {
    console.error('Error marking all notifications read:', error)
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 })
  }
}