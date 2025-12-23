import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notif = await prisma.notification.findUnique({ where: { id } })
    if (!notif || notif.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updated = await prisma.notification.update({ where: { id }, data: { read: true } })
    return NextResponse.json({ success: true, notification: updated })
  } catch (error) {
    console.error('Error marking notification read:', error)
    return NextResponse.json({ error: 'Failed to mark read' }, { status: 500 })
  }
}