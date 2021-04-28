import redis from 'redis'
import redisStore from 'connect-redis'
import session from 'express-session'
import express from 'express'
import { config } from '../config/config'

export const REDIS_KEY_PREFIXES = {
  VERIFICATION_TOKEN: 'verify-token-'
}

export const redisClient = redis.createClient(config.redis)

export const getRedisStore = (session: (options?: session.SessionOptions) => express.RequestHandler) => {
  const RedisStore = redisStore(session)

  const store = new RedisStore({
    client: redisClient
  })

  return store
}

export const setRedisKey = (key: string, val: string) => new Promise((resolve, reject) => {
  redisClient.set(key, val, (err, reply) => {
    if (err) reject(err)
    resolve(reply)
  })
})

export const getRedisKey = (key: string) => new Promise((resolve, reject) => {
  redisClient.get(key, (err, reply) => {
    if (err) reject(err)
    resolve(reply)
  })
})

export const delRedisKey = (key: string) => new Promise((resolve, reject) => {
  redisClient.del(key, (err, reply) => {
    if (err) reject(err)
    resolve(reply)
  })
})