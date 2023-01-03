import express from 'express'
import cors from 'cors'
import { connectToDb } from './services/mongo'
import { startApolloServer } from './services/graphql'
import { sessionService } from './services/session'
import { config } from './config/config'
import { oauthRouter } from './routes'

const startApp = async() => {
  await connectToDb()

  const app = express()

  app.use(cors({
    origin: config.frontEndBaseUrl,
    credentials: true
  }))

  const sessionMiddleWare = sessionService()

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json())
  app.use(sessionMiddleWare)
  app.use('/oauth', oauthRouter)

  const { httpServer } = await startApolloServer(app, sessionMiddleWare)

  httpServer.listen(config.port, () => {
    console.log(`The app is listening on port ${config.port}!`);
  })
}

startApp()
