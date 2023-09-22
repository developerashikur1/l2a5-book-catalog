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

  //   console.log(filtersData);
  //   console.log(
  //     Object.entries(filtersData).map(([field, value]) => ({
  //       [field]: value,
  //     }))
  //   );

  console.log(filtersData);

  if (Object.keys(filtersData).includes("genre") && filtersData.genre) {
    andConditions.push({
      $and: [
        {
          genre: filtersData.genre,
        },
      ],
    });
  }

  if (
    Object.keys(filtersData).includes("publicationYear") &&
    filtersData.publicationYear
  ) {
    var regexPattern = new RegExp(".*" + filtersData.publicationYear + "-.*");
    console.log(regexPattern);
    andConditions.push({
      $and: [
        {
          publicationDate: regexPattern,
        },
      ],
    });
  }

  console.log(andConditions.forEach((e) => console.log(e)));

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

  console.log("tokensss", token)

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

// comment on book
const getSearchOptions = async () => {
  try {
    // Use await to wait for the distinct result.
    const uniqueGenres = await Book.distinct("genre");

    const uniquePublicationYears = await Book.aggregate([
      {
        $project: {
          year: {
            $year: { $dateFromString: { dateString: "$publicationDate" } },
          },
        },
      },
      {
        $group: {
          _id: "$year",
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    return {
      genre: uniqueGenres,
      publicationYears: uniquePublicationYears.map((result) => result._id),
    };
  } catch (error) {
    // Handle any errors that may occur during the database operation.
    throw new ApiError(httpStatus.NOT_FOUND, "Book filters generated failed.");
  }
};

export const BookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
  commentOnBook,
  getSearchOptions,
};
