import { config } from "../config/config";
import { User } from "../schema"

interface siteDownEmailFormatInput {
  userName: string;
  website: string;
  downTime: number;
}

export const siteDownEmailFormat = (input: siteDownEmailFormatInput) => {
  const { website, userName, downTime, } = input
  
  return {
    subject: `${website} is down.`,
    body: `Hi ${userName}, ${website} is down. Last checked on ${new Date(downTime).toTimeString()}.`
  }
}

export const userAccountCreatedEmailFormat = (user: User, token: string) => {
  const url = `${config.frontEndBaseUrl}/verify-user?token=${token}`

  return {
    subject: 'Account Created',
    html: `Hi ${user.userName}, your account is created. Click <a target="_blank" href="${url}">here<a/> to verify.`
  }
}