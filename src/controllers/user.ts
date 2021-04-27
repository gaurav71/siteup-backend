import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'
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

  const secret = uuidv4()

  const hashedPassword = CryptoJS.AES.encrypt(input.password, secret).toString()

  const userDoc = new User({
    userName: input.userName,
    email: input.email,
    password: hashedPassword,
    sendMailOnFailure: input.sendMailOnFailure,
    secret
  })

  const user = await userDoc.save()

  context.req.session.userId = user._id

  return user
}

export const loginUserController = async(input: LoginUserInput, context: Context) => {
  const user = await User.findOne({
    email: input.email
  })

  if (!user) {
    throw new Error('User not found')
  }
 
  const bytes  = CryptoJS.AES.decrypt(user.password, user.secret)
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8)

  if (originalPassword !== input.password) {
    throw new Error('Wrong Password')
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