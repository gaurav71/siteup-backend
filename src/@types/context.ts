import { PubSub } from 'apollo-server-express'
import { request, Request, Response } from 'express';
import { ExecutionParams } from 'subscriptions-transport-ws';
import { subscriptionTypes } from '../graphql';

export type EnhancedRequest = Request & { session: typeof request.session & { userId?: string } }

export interface Context {
  req: EnhancedRequest,
  res: Response
  connection: ExecutionParams<any>
  subscriptionTypes: typeof subscriptionTypes
  pubsub: PubSub
}