import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { SettingsForm } from './settings-form'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function SettingsPage() {
  const session = await auth()
  const t = await getTranslations('common')
  
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id! },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          {/* Cover Section */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600"></div>
          
          {/* Profile Info Section */}
          <div className="px-6 pb-6 -mt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Profile Image */}
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.username || 'User'}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">
                      {(user.name || user.username || user.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 pt-20 sm:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.name || user.username || 'User'}
                    </h1>
                    {user.username && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        @{user.username}
                      </p>
                    )}
                    {user.bio && (
                      <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-2xl">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  
                  {user.username && (
                    <Link
                      href={`/users/${user.username}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-center"
                    >
                      {t('viewProfile')}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex gap-8 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user._count.posts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('posts')}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user._count.followers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('followers')}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user._count.following}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('following')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('editProfile')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('editProfileDescription')}
            </p>
          </div>
          <div className="p-6">
      <SettingsForm user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

