import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendReponse from "../../../shared/sendResponse";
import { UserService } from "./users.service";

const signUpUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await UserService.signUpUser(userData);

  console.log(result);

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User signup successfully.",
    data: result,
  });
});

const signInUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await UserService.signInUser(userData);

  const { refreshToken, ...rest } = result;

  // set refreshToken
  const cookieOption = {
    secure: config.env === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOption);

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully.",
    data: rest,
  });
});

export const UserController = {
  signUpUser,
  signInUser,
};
