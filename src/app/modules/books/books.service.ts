import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { SortOrder } from "mongoose";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { booksSearchableFields } from "./books.constant";
import { IBook, IBookFilters } from "./books.interface";
import { Book } from "./books.model";

const createBook = async (bookData: IBook) => {
  const result = await Book.create(bookData);

  return result;
};

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: booksSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate("createdBy")
    .populate("reviews.user");

  const total = await Book.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBook = async (bookId: string): Promise<IBook | null> => {
  const result = await Book.findById(bookId)
    .populate("createdBy")
    .populate("reviews.user");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book not found!");
  }

  return result;
};

const deleteBook = async (bookId: string): Promise<IBook | null> => {
  const result = await Book.findByIdAndDelete(bookId)
    .populate("createdBy")
    .populate("reviews.user");

  return result;
};

// comment on book
const commentOnBook = async (bookId: string, token: string, review: string) => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token as Secret
    );

    if (!verifiedToken) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
    }
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
  }

  const { userEmail, userPhone, user } = verifiedToken;

  const userReviewData = {
    user,
    review,
  };

  //   console.log(bookId);
  const result = await Book.findByIdAndUpdate(
    { _id: bookId },
    {
      $push: {
        reviews: userReviewData,
      },
    }
  );
  // .populate("createdBy")
  // .populate("reviews.user");

  return result;
};

export const BookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
  commentOnBook,
};
