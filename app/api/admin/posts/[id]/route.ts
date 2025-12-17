import { NextRequest, NextResponse } from 'next/server'
import { requireModerator } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireModerator()
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireModerator()
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { isPublic } = body

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { isPublic: isPublic === false ? false : true },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post visibility:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

