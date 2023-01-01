require('dotenv').config()

export const config = {
  port: process.env.PORT,
  apiHost: process.env.API_HOST,
  frontEndBaseUrl: process.env.FRONTEND_HOST,
  mongo: {
    uri: process.env.DB_HOST,
    dbName: process.env.DB_NAME
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS
  },
  session: {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.SAME_SITE as ("lax" | "strict"),
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true
    }
  },
  officialEmail: 'test@mail.com',
  verifyUserTimeLimit: 1000 * 60 * 2,
}