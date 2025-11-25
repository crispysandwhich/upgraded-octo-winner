import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  image: string;
  role: string;
  isPro: boolean;
  metaAddress: string;
  sig: string;
  description: string;
}

// TODO: Make it better......

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      min: 4,
      max: 24,
    },
    password: {
      type: String
    },
    email: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    metaAddress: {
      type: String,
    },
    sig: {
      type: String,
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN", "CAPTAIN"],
    },
    isPro: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

let UserModel: mongoose.Model<IUser>;

try {
  // Try to retrieve an existing model
  UserModel = mongoose.model<IUser>("User");
} catch (e) {
  // If the model doesn't exist, define it
  UserModel = mongoose.model<IUser>("User", UserSchema);
}

export const User = UserModel;