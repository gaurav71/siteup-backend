import { Context } from "../@types/context"
import { CreateUserInput, LoginUserInput } from "../graphql/typedefs/User"
import { User } from "../schema"
import { checkAuth } from "../utilities/checkAuth"

export const createUserController = async(input: CreateUserInput, context: Context) => {
  const userAlreadyCreated = await User.findOne({
    $or: [
      { email: input.email },
      { userName: input.userName }
    ]
  })

  if (userAlreadyCreated) {
    const sameEmail = userAlreadyCreated.email === input.email
    const message = sameEmail ? 'Email already used' : 'Username already taken'

    throw new Error(message)
  }

  const userDoc = new User({
    userName: input.userName,
    email: input.email,
    password: input.password,
    sendMailOnFailure: input.sendMailOnFailure
  })

  const user = await userDoc.save()

  context.req.session.userId = user._id

  return user
}

export const loginUserController = async(input: LoginUserInput, context: Context) => {
  const user = await User.findOne({
    email: input.email,
    password: input.password
  })

  if (!user) {
    throw new Error('User not found')
  }

  context.req.session.userId = user._id

  return user
}

export const getUserFromSession = async(context: Context) => {
  checkAuth(context)

  return User.findById(context.req.session.userId)
}

export const logoutController = async(context: Context) => {
  return new Promise((resolve, reject) => {
    context.req.session.destroy((err) => {
      if (err) {
        reject("error")
      }
      resolve("logged out")
    })
  })
}