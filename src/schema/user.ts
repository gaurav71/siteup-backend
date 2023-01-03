import { Schema, Document, model, Model } from 'mongoose';

export const userStatusTypes = Object.freeze({
  UNVERIFIED: 'UNVERIFIED',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  ONLY_OAUTH_VERIFIED: 'ONLY_AUTH_VERIFIED'
})

const userSchema = new Schema<User, Model<User>>({
  userName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    default: "User"
  },
  sendMailOnFailure: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(userStatusTypes),
    required: true,
    default: userStatusTypes.UNVERIFIED
  }
});

userSchema.virtual('id').get(function(
  this: User
) {
  return ''+this._id
})

export interface IUser {
  userName: string;
  email: string;
  password: string;
  userType: string;
  sendMailOnFailure: boolean;
  secret: string;
  status: string;
}

interface User extends IUser, Document {
  _id: string;
}

const User = model<User, Model<User>>('user', userSchema);

export default User