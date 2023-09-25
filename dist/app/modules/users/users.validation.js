"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const signUpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
        phone: zod_1.z.string({ required_error: "Phone is required" }),
        address: zod_1.z.string({ required_error: "Address is required" }),
        profession: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        wishlist: zod_1.z
            .array(zod_1.z.string().refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
            message: "Invalid ObjectId",
        }))
            .optional(),
        readingList: zod_1.z
            .array(zod_1.z.string().refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
            message: "Invalid ObjectId",
        }))
            .optional(),
        finishedList: zod_1.z
            .array(zod_1.z.string().refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
            message: "Invalid ObjectId",
        }))
            .optional(),
    }),
});
const signInZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const addToWishList = zod_1.z.object({
    body: zod_1.z.object({
        bookId: zod_1.z.string({ required_error: "BookId is required" }),
    }),
});
exports.UserValidation = {
    signUpZodSchema,
    signInZodSchema,
    addToWishList,
};
