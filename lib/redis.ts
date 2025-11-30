import Redis from 'ioredis'

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL
  }
  throw new Error('REDIS_URL is not defined')
}

const redis = new Redis(getRedisUrl())

redis.on('error', (err) => {
  console.error('Redis Client Error', err)
})

redis.on('connect', () => {
  console.log('Redis Client Connected')
})

export default redis

