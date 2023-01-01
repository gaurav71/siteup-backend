import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'
import { Context } from "../@types/context"
import { config } from '../config/config'
import { CreateUserInput, LoginUserInput, UpdateUserInput } from "../graphql/typedefs/User"
import { User } from "../schema"
import { userStatusTypes } from '../schema/user'
import { sendMail } from '../services/mailer'
import { delRedisKey, getRedisKey, REDIS_KEY_PREFIXES, setRedisKey } from '../services/redis'
import { checkAuth } from "../utilities/checkAuth"
import { userAccountCreatedEmailFormat } from '../utilities/messageFormatter'

const sendVerificationMail = async(user: User) => {
  const verificationToken = uuidv4()

  await setRedisKey(
    `${REDIS_KEY_PREFIXES.VERIFICATION_TOKEN}${verificationToken}`,
    JSON.stringify({ userId: user._id, creationTime: Date.now() })
  )

  sendMail({
    to: user.email,
    from: config.officialEmail,
    ...userAccountCreatedEmailFormat(user, verificationToken)
  })
}

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
    sendMailOnFailure: false,
    status: userStatusTypes.UNVERIFIED,
    secret
  })

  const user = await userDoc.save()

  await sendVerificationMail(user)

  return 'Email with verification link is sent to your email.'
}

export const updateUserController = async(input: UpdateUserInput, context: Context) => {
  checkAuth(context)

  const user = await User.findById(context.req.session.userId)

  if (!user) {
    throw new Error('User not found')
  }

  return User.findOneAndUpdate(
    { _id: user._id },
    { ...input },
    { new: true }
  )
}

export const resendVerificationMailController = async(email: string) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.status !== userStatusTypes.UNVERIFIED) {
    throw new Error('User already verified')
  }

  await sendVerificationMail(user)

  return 'Email with verification link is sent to your email.'
}

export const verifyUserController = async(token: string, context: Context) => {
  const tokenDetails: any = await getRedisKey(`${REDIS_KEY_PREFIXES.VERIFICATION_TOKEN}${token}`)

  if (!tokenDetails) {
    throw new Error('Invalid token')
  }

  const parsedTokenDetails = JSON.parse(tokenDetails)

  await delRedisKey(`${REDIS_KEY_PREFIXES.VERIFICATION_TOKEN}${token}`)

  if (parsedTokenDetails.creationTime + config.verifyUserTimeLimit < Date.now()) {
    throw new Error('Token expired')
  }

  context.req.session.userId = parsedTokenDetails.userId

  return User.findOneAndUpdate(
    { _id: parsedTokenDetails.userId },
    { status: userStatusTypes.ACTIVE }
  )
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

  if (user.status === userStatusTypes.UNVERIFIED) {
    throw new Error('Account not verified')
  }

  if (user.status !== userStatusTypes.ACTIVE) {
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