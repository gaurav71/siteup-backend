import { config } from "../config/config";

import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client(config.google.oauth2ClientId);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: config.google.oauth2ClientId,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  return payload
}