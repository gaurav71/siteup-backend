import { request, Request, Response } from 'express';

export interface Context {
  req: Request & { session: typeof request.session & { userId?: string } },
  res: Response
}