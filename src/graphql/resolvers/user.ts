
import { Context } from '../../@types/context'
import { createUserController, getUserFromSession, loginUserController, logoutController, resendVerificationMailController, updateUserController, verifyUserController } from '../../controllers/user'
import { CreateUserInput, LoginUserInput, UpdateUserInput } from '../typedefs/User'

export const user = (parent: any, args: any, context: Context, info: any) => {
  return getUserFromSession(context)
}

export const createUser = (parent: any, args: { input: CreateUserInput }, context: Context, info: any) => {
  return createUserController(args.input, context)
}

export const updateUser = (parent: any, args: { input: UpdateUserInput }, context: Context, info: any) => {
  return updateUserController(args.input, context)
}

export const verifyUser = (parent: any, args: { token: string }, context: Context, info: any) => {
  return verifyUserController(args.token, context)
}

export const resenedVericiationMail = (parent: any, args: { email: string }, context: Context, info: any) => {
  return resendVerificationMailController(args.email)
}

export const login = (parent: any, args: { input: LoginUserInput }, context: Context, info: any) => {  
  return loginUserController(args.input, context)
}

export const logout = (parent: any, args: any, context: Context, info: any) => {
  return logoutController(context)
}