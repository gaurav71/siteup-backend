import redis from 'redis'
import redisStore from 'connect-redis'
import session from 'express-session'
import express from 'express'
import { config } from '../config/config'

export const getRedisStore = (session: (options?: session.SessionOptions) => express.RequestHandler) => {
  const RedisStore = redisStore(session)
  
  const redisClient = redis.createClient(config.redis)

  const store = new RedisStore({
    client: redisClient
  })

  return store
}