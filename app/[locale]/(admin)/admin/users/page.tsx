import { redirect } from '@/i18n/navigation'
import { requireAdmin } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

export default async function AdminUsersPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{user.name || user.username || user.email}</h3>
                <p className="text-sm text-gray-500">@{user.username || 'no username'}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
                <p className="text-sm text-gray-500">
                  {user._count.posts} posts, {user._count.followers} followers
                </p>
              </div>
              <div className="flex gap-2">
                {user.role !== 'MODERATOR' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Make Moderator
                  </button>
                )}
                {user.role !== 'ADMIN' && (
                  <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                    Make Admin
                  </button>
                )}
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Ban
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

