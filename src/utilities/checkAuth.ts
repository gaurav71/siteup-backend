import { Context } from "../@types/context";

export const checkAuth = (context: Context) => {
  if (!context.req.session.userId) {
    throw new Error("Not Authenticated")
  }
  return !!context.req.session.userId
}