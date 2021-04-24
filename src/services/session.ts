import session from 'express-session'
import { config } from '../config/config'
import { getRedisStore } from './redis'

const redisStore = getRedisStore(session)

export const sessionService = () => session({
  store: redisStore,
  name: config.session.name,
  secret: config.session.secret,
  resave: config.session.resave,
  saveUninitialized: config.session.saveUninitialized,
  cookie: {
    secure: config.session.cookie.secure,
    maxAge: config.session.cookie.maxAge,
    httpOnly: config.session.cookie.httpOnly,
    sameSite: config.session.cookie.sameSite
  }
})
