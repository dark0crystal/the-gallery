'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'

interface LeaderboardUser {
  rank: number
  user_id: string
  username: string | null
  name: string | null
  avatar_url: string | null
  post_count: number
}

export default function TopUsersPage() {
  const t = useTranslations('leaderboard')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/leaderboard/top-users?limit=100')
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }

        const data = await response.json()
        setUsers(data.data || [])
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        setError(t('leaderboardError'))
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [t])

  const handleUserClick = (user: LeaderboardUser) => {
    // Use username if available, otherwise use user_id as fallback
    const identifier = user.username || user.user_id
    if (identifier) {
      router.push(`/users/${identifier}`)
    }
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900'
    if (rank === 2) return 'bg-gray-300 text-gray-800'
    if (rank === 3) return 'bg-orange-400 text-orange-900'
    return 'bg-gray-100 text-gray-700'
  }

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">{t('topCreators')}</h1>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">{tCommon('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">{t('topCreators')}</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">{t('topCreators')}</h1>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">{t('noUsers')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">{t('topCreators')}</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('rank')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {tCommon('username')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('postCount')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const isTopThree = user.rank <= 3
              const emoji = getRankEmoji(user.rank)
              
              return (
                <tr
                  key={user.user_id}
                  onClick={() => handleUserClick(user)}
                  className={`
                    cursor-pointer transition-colors
                    ${isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100' : 'hover:bg-gray-50'}
                    ${isTopThree ? 'border-l-4 border-yellow-400' : ''}
                  `}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleUserClick(user)
                    }
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${getRankBadgeColor(user.rank)}`}>
                        {emoji || user.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
                              {(user.name || user.username || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || user.username || `User ${user.rank}`}
                        </div>
                        {user.username && (
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.post_count} {t('postCount')}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {users.map((user) => {
          const isTopThree = user.rank <= 3
          const emoji = getRankEmoji(user.rank)
          
          return (
            <div
              key={user.user_id}
              onClick={() => handleUserClick(user)}
              className={`
                bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all
                ${isTopThree ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200 hover:border-gray-300'}
                active:scale-[0.98]
              `}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleUserClick(user)
                }
              }}
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankBadgeColor(user.rank)}`}>
                    {emoji || user.rank}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="flex-shrink-0">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.username}
                          width={48}
                          height={48}
                          className="rounded-full"
                          unoptimized
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {(user.name || user.username || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-gray-900 truncate">
                        {user.name || user.username || `User ${user.rank}`}
                      </div>
                      {user.username && (
                        <div className="text-sm text-gray-500 truncate">
                          @{user.username}
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-700 mt-1">
                        {user.post_count} {t('postCount')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

