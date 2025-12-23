import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Use raw SQL query for efficient aggregation and ordering
    const leaderboardData = await prisma.$queryRaw<Array<{
      user_id: string
      username: string | null
      name: string | null
      image: string | null
      created_at: Date
      post_count: bigint
    }>>`
      SELECT 
        u.id as user_id,
        u.username,
        u.name,
        u.image,
        u."createdAt" as created_at,
        COUNT(p.id)::int as post_count
      FROM users u
      INNER JOIN posts p ON p."userId" = u.id
      GROUP BY u.id, u.username, u.name, u.image, u."createdAt"
      HAVING COUNT(p.id) > 0
      ORDER BY post_count DESC, u."createdAt" ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    // Calculate rank (accounting for offset)
    const leaderboard = leaderboardData.map((user, index) => ({
      rank: offset + index + 1,
      user_id: user.user_id,
      username: user.username, // Keep original username (can be null)
      name: user.name,
      avatar_url: user.image,
      post_count: Number(user.post_count),
    }))

    return NextResponse.json({
      data: leaderboard,
      total: leaderboard.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

