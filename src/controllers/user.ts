import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'
import { Context, EnhancedRequest } from "../@types/context"
import { config } from '../config/config'
import { CreateUserInput, LoginUserInput, UpdateUserInput } from "../graphql/typedefs/User"
import { User } from "../schema"
import { userStatusTypes } from '../schema/user'
import { sendMail } from '../services/mailer'
import { checkAuth } from "../utilities/checkAuth"
import { userAccountCreatedEmailFormat } from '../utilities/messageFormatter'
import { verifyGoogleToken } from './oauth'

const getCleanUser = (user: User) => ({
  _id: user._id,
  userName: user.userName,
  email: user.email,
  userType: user.userType,
  sendMailOnFailure: user.sendMailOnFailure
})

const sendVerificationMail = async(user: User) => {
  const verificationToken = uuidv4()

  await User.findOneAndUpdate(
    { _id: user._id },
    { emailVerificationToken: verificationToken }
  )

  sendMail({
    to: user.email,
    from: config.officialEmail,
    ...userAccountCreatedEmailFormat(user, verificationToken)
  })
}

export const createUserController = async(input: CreateUserInput) => {
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

  const hashedPassword = CryptoJS.AES.encrypt(input.password, config.cryptoSecret).toString()

  const userDoc = new User({
    userName: input.userName,
    email: input.email,
    password: hashedPassword,
    sendMailOnFailure: false,
    status: userStatusTypes.UNVERIFIED,
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

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { ...input },
    { new: true }
  )

  return getCleanUser(updatedUser)
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
  const userWithToken = await User.findOne({
    emailVerificationToken: token,
    status: userStatusTypes.UNVERIFIED
  })

  if (!userWithToken) {
    throw new Error('Invalid token')
  }

  if (userWithToken.emailVerificationTokenExpiresOn < Date.now()) {
    throw new Error('Token expired')
  }

  context.req.session.userId = userWithToken._id

  const user = await User.findOneAndUpdate(
    { _id: userWithToken._id },
    { status: userStatusTypes.ACTIVE }
  )

  return getCleanUser(user)
}

export const loginUserController = async(input: LoginUserInput, context: Context) => {
  const user = await User.findOne({
    email: input.email
  })

  if (!user) {
    throw new Error('User not found')
  }
 
  const bytes  = CryptoJS.AES.decrypt(user.password, user.emailVerificationToken)
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

  return getCleanUser(user)
}

export const loginGoogleOauthUser = async(req: EnhancedRequest, payload: any) => {
  const userData = await verifyGoogleToken(payload.credential)

  if (!userData) {
    throw new Error('User not found')
  }

  let user = await User.findOne({ email: userData.email })

  if (!user) {
    const uuid = uuidv4()

    const userDoc = new User({
      userName: userData.email,
      email: userData.email,
      password: uuid,
      sendMailOnFailure: false,
      status: userStatusTypes.ONLY_OAUTH_VERIFIED,
      emailVerificationToken: uuid
    })

    user = await userDoc.save()
  }

  const allowedUserStatuses: string[] = [userStatusTypes.ACTIVE, userStatusTypes.ONLY_OAUTH_VERIFIED]

  if (!allowedUserStatuses.includes(user.status)) {
    throw new Error('User not found')
  }

  req.session.userId = user._id

  return getCleanUser(user)
}

export const getUserFromSession = async(context: Context) => {
  console.log(context.req.session)
  checkAuth(context)
  const user = await User.findById(context.req.session.userId)
  return getCleanUser(user)
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