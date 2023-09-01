import { Request, Response } from "express";
import httpStatus from "http-status";
import { pagianationFileds } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendReponse from "../../../shared/sendResponse";
import { booksFilterableFields } from "./books.constant";
import { IBook } from "./books.interface";
import { BookService } from "./books.service";

const createBook = catchAsync(async (req: Request, res: Response) => {
  const bookData = req.body;
  const result = await BookService.createBook(bookData);

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book created successfully.",
    data: result,
  });
});

const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, booksFilterableFields);

  const pagianationOptions = pick(req.query, pagianationFileds);

  const result = await BookService.getAllBooks(filters, pagianationOptions);

  sendReponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.id;

  const result = await BookService.getSingleBook(bookId);

  sendReponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully.",
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.id;

  const result = await BookService.deleteBook(bookId);

  sendReponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleled successfully.",
    data: result,
  });
});

const commentOnBook = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const bookId = req.params.id;
  const { review } = req.body;

  const result = await BookService.commentOnBook(bookId, refreshToken, review);

  console.log(result, "comment");

  //   const { refreshToken, ...rest } = result;

  // set refreshToken
  //   const cookieOption = {
  //     secure: config.env === "production",
  //     httpOnly: true,
  //   };
  //   res.cookie("refreshToken", refreshToken, cookieOption);

  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully.",
    data: result,
  });
});

export const BookController = {
  createBook,
  getAllBook,
  getSingleBook,
  deleteBook,
  commentOnBook,
};
