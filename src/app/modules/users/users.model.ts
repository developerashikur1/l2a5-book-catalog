import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import config from "../../../config";
import { IUser, IUserExist, UserModel } from "./users.interface";

export const UserSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    address: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    whiteList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    readingList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// statics instences
UserSchema.statics.isUserExist = async function (
  email: string
): Promise<Pick<IUserExist, "_id" | "email" | "phone" | "password"> | null> {
  return await User.findOne(
    { email },
    { password: 1, phone: 1, email: 1, _id: 1 }
  );
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// pre hooks
UserSchema.pre("save", async function (next) {
  const user = this;
  // hashing pass
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round)
  );

  next();
});

export const User = model<IUser, UserModel>("User", UserSchema);
