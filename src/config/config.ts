require('dotenv').config()

export const config = {
  port: process.env.PORT,
  apiHost: process.env.API_HOST,
  frontEndBaseUrl: process.env.FRONTEND_HOST,
  cryptoSecret: process.env.CRYPTO_SECRET,
  mongo: {
    uri: process.env.DB_HOST,
    dbName: process.env.DB_NAME
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS
  },
  google: {
    oauth2ClientId: process.env.GOOGLE_OAUTH2_CLIENT_ID
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
  emailServer: {
    host: process.env.SMTP_SERVER_HOST,
    port: Number(process.env.SMTP_SERVER_PORT),
    email: process.env.SMTP_SERVER_EMAIL,
    user: process.env.SMTP_SERVER_USER,
    key: process.env.SMTP_SERVER_KEY,
  },
  officialEmail: 'test@mail.com',
  verifyUserTimeLimit: 1000 * 60 * 2,
}