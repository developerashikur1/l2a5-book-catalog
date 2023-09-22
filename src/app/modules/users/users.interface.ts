import { Model, Types } from "mongoose";

export type IUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  profession: string;
  profileImage?: string;
  whiteList?: Types.ObjectId[];
  readingList?: Types.ObjectId[];
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IUserLoginResponse = {
  accessToken: string;
  refreshToken?: string | undefined;
  userInfo: IUser | null;
};

export type IUserExist = {
  _id: string;
  email: string;
  phone: string;
  password: string;
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<IUserExist, "_id" | "email" | "phone" | "password"> | null>;

  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser, Record<string, unknown>>;
