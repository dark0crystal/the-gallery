import redis from './redis'

const CACHE_TTL = {
  USER_PROFILE: 3600, // 1 hour
  POST_FEED: 1800, // 30 minutes
  LOCATION: 86400, // 24 hours
  SOCIAL_GRAPH: 900, // 15 minutes
  POST_DETAIL: 1800, // 30 minutes
} as const

export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  post: (postId: string) => `post:${postId}`,
  location: (locationId: string) => `location:${locationId}`,
  feed: (userId: string) => `feed:${userId}`,
  followers: (userId: string) => `followers:${userId}`,
  following: (userId: string) => `following:${userId}`,
} as const

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    if (!data) return null
    return JSON.parse(data) as T
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Cache delete pattern error:', error)
  }
}

export { CACHE_TTL }

