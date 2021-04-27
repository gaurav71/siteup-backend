import { PubSub } from 'apollo-server-express'
import { request, Request, Response } from 'express';
import { ExecutionParams } from 'subscriptions-transport-ws';
import { subscriptionTypes } from '../graphql';

export interface Context {
  req: Request & { session: typeof request.session & { userId?: string } },
  res: Response
  connection: ExecutionParams<any>
  subscriptionTypes: typeof subscriptionTypes
  pubsub: PubSub
}