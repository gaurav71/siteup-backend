import http from 'http'
import { Express } from 'express'
import { PubSub } from 'apollo-server-express'
import { ApolloServer } from 'apollo-server-express';
import { Context } from '../@types/context';
import { typeDefs, resolvers, subscriptionTypes } from '../graphql'
import { SessionMiddleWareType } from './session';

const startApolloServer = async(app: Express, sessionMiddleWare: SessionMiddleWareType) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      onConnect: (_, webSocket: any) => new Promise((resolve, reject) => {
        sessionMiddleWare(webSocket.upgradeReq, {} as any, () => {
          if (!webSocket.upgradeReq.session.userId) {
            reject(new Error('Not Authenticated'))
          }

          resolve({ userId: webSocket.upgradeReq.session.userId })
        })
      }),
    },
    context: ({ req, res, connection }): Context => ({
      req,
      res,
      connection,
      subscriptionTypes,
      pubsub
    }),
    playground: {
      settings: {
        "request.credentials": "include"
      }
    }
  })

  await server.start()
  
  server.applyMiddleware({ app, cors: false })
  
  const httpServer = http.createServer(app)
  
  server.installSubscriptionHandlers(httpServer)

  return {
    app,
    server,
    httpServer
  } 
}

const pubsub = new PubSub()

export {
  startApolloServer,
  pubsub
}