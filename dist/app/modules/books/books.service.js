"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const books_constant_1 = require("./books.constant");
const books_model_1 = require("./books.model");
const createBook = (bookData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_model_1.Book.create(bookData);
    return result;
});
const getAllBooks = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: books_constant_1.booksSearchableFields.map((field) => ({
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
    if (Object.keys(filtersData).includes("publicationYear") &&
        filtersData.publicationYear) {
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
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield books_model_1.Book.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .populate("createdBy")
        .populate("reviews.user");
    const total = yield books_model_1.Book.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_model_1.Book.findById(bookId)
        .populate("createdBy")
        .populate("reviews.user");
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Book not found!");
    }
    return result;
});
const deleteBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_model_1.Book.findByIdAndDelete(bookId)
        .populate("createdBy")
        .populate("reviews.user");
    return result;
});
// comment on book
const commentOnBook = (bookId, token, review) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        const partsToken = token.split(" ");
        if (partsToken.length === 2) {
            let scheme = partsToken[0];
            token = partsToken[1];
            if (/^Bearer$/i.test(scheme)) {
                verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_token);
            }
        }
        if (!verifiedToken) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
        }
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
    }
    const { userEmail, userPhone, user } = verifiedToken;
    const userReviewData = {
        user,
        review,
    };
    //   console.log(bookId);
    const result = yield books_model_1.Book.findByIdAndUpdate({ _id: bookId }, {
        $push: {
            reviews: userReviewData,
        },
    });
    // .populate("createdBy")
    // .populate("reviews.user");
    return result;
});
// comment on book
const getSearchOptions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use await to wait for the distinct result.
        const uniqueGenres = yield books_model_1.Book.distinct("genre");
        const uniquePublicationYears = yield books_model_1.Book.aggregate([
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
    }
    catch (error) {
        // Handle any errors that may occur during the database operation.
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Book filters generated failed.");
    }
});
exports.BookService = {
    createBook,
    getAllBooks,
    getSingleBook,
    deleteBook,
    commentOnBook,
    getSearchOptions,
};
