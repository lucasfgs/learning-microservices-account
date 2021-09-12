import { createClient } from 'redis'

export const redisClient = createClient(process.env.REDIS_PORT)
