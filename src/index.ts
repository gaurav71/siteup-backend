import express from 'express'
import cors from 'cors'
import { connectToDb } from './services/mongo'
import { server } from './services/graphql'
import { sessionService } from './services/session'
import { config } from './config/config'

const startApp = async() => {
  await connectToDb()

  const app = express()

  app.use(cors({
    origin: config.frontEndBaseUrl,
    credentials: true
  }))

  app.use(sessionService())

  server.applyMiddleware({ app, cors: false })

  app.listen(config.port, () => {
    console.log(`The app is listening on port ${config.port}!`);
  })
}

startApp()
