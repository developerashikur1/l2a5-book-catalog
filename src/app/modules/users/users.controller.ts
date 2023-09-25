import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendReponse from "../../../shared/sendResponse";
import { UserService } from "./users.service";

const signUpUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await UserService.signUpUser(userData);

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

const signOutUser = catchAsync(async (req: Request, res: Response) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
    })

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully.",
    data: null,
  });
});

const addToWishList = catchAsync(async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization;
    const {bookId} = req.body;
    const result = await UserService.addToWishList(bookId, accessToken as string)

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Add to wishlist successfully.",
    data: result,
  });
});

const addToReadingList = catchAsync(async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization;
    const {bookId} = req.body;
    const result = await UserService.addToReadingList(bookId, accessToken as string)

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Add to readinglist successfully.",
    data: result,
  });
});

const addToFinishedList = catchAsync(async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization;
    const {bookId} = req.body;
    const result = await UserService.addToFinishedList(bookId, accessToken as string)

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Add to finishedlist successfully.",
    data: result,
  });
});

const removeFromFinishedList = catchAsync(async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization;
    const {bookId} = req.body;
    const result = await UserService.removeFromFinishedList(bookId, accessToken as string)

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Removed from finishedlist successfully.",
    data: result,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization;
    const result = await UserService.getProfile(accessToken as string)

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile get successfully.",
    data: result,
  });
});

export const UserController = {
  signUpUser,
  signInUser,
  signOutUser,
  addToWishList,
  getProfile,
  addToReadingList,
  addToFinishedList,
  removeFromFinishedList,
};
