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

        const existingSave = await prisma.save.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id!,
                    postId: id,
                },
            },
        })

        if (existingSave) {
            await prisma.save.delete({
                where: { id: existingSave.id },
            })
            return NextResponse.json({ saved: false })
        }

        await prisma.save.create({
            data: {
                userId: session.user.id!,
                postId: id,
            },
        })

        return NextResponse.json({ saved: true })
    } catch (error) {
        console.error('Error toggling save:', error)
        return NextResponse.json({ error: 'Failed to toggle save' }, { status: 500 })
    }
}
