
import { Context } from '../../@types/context'
import { createUserController, getUserFromSession, loginUserController, logoutController } from '../../controllers/user'
import { CreateUserInput, LoginUserInput } from '../typedefs/User'

export const user = (parent: any, args: any, context: Context, info: any) => {
  return getUserFromSession(context)
}

export const createUser = (parent: any, args: { input: CreateUserInput }, context: Context, info: any) => {
  return createUserController(args.input, context)
}

export const login = (parent: any, args: { input: LoginUserInput }, context: Context, info: any) => {  
  return loginUserController(args.input, context)
}

export const logout = (parent: any, args: any, context: Context, info: any) => {
  return logoutController(context)
}