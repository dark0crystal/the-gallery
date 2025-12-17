import { redirect } from '@/i18n/navigation'
import { requireAdmin } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboardPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  const [userCount, postCount, locationCount, categoryCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.location.count(),
    prisma.category.count(),
  ])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">{userCount}</h2>
          <p className="text-gray-500">Total Users</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">{postCount}</h2>
          <p className="text-gray-500">Total Posts</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">{locationCount}</h2>
          <p className="text-gray-500">Total Locations</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">{categoryCount}</h2>
          <p className="text-gray-500">Total Categories</p>
        </div>
      </div>
      <div className="space-y-4">
        <a
          href="/admin/users"
          className="block p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm text-gray-500">Manage users and roles</p>
        </a>
        <a
          href="/admin/moderation"
          className="block p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-semibold">Content Moderation</h3>
          <p className="text-sm text-gray-500">Moderate posts and comments</p>
        </a>
        <a
          href="/admin/categories"
          className="block p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-semibold">Category Management</h3>
          <p className="text-sm text-gray-500">Manage post categories</p>
        </a>
      </div>
    </div>
  )
}

