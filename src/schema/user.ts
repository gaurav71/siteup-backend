import { Schema, Document, model, Model } from 'mongoose';

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
}

interface User extends IUser, Document {
  _id: string;
}

const User = model<User, Model<User>>('user', userSchema);

export default User