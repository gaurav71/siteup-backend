import { ApolloServer } from 'apollo-server-express';
import { Context } from '../@types/context';
import { typeDefs, resolvers } from '../graphql'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }): Context => ({
    req,
    res
  }),
  playground: {
    settings: {
      "request.credentials": "include"
    }
  }
})

export {
  server
}