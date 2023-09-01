import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { ILoginUser, IUser, IUserLoginResponse } from "./users.interface";
import { User } from "./users.model";

const signUpUser = async (userData: IUser): Promise<IUser> => {
  const result = await User.create(userData);

  return result;
};

const signInUser = async (payload: ILoginUser): Promise<IUserLoginResponse> => {
  //   const result = await User.create(userData);

  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect!");
  }

  const { email: userEmail, phone: userPhone, _id: user } = isUserExist;
  //   create access & refresh token
  const accessToken = jwtHelpers.createToken(
    { user, userEmail, userPhone },
    config.jwt.access_token as Secret,
    config.jwt.access_expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { user, userEmail, userPhone },
    config.jwt.refresh_token as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const UserService = {
  signUpUser,
  signInUser,
};
