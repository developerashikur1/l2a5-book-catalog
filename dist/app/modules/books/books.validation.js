"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidation = void 0;
const zod_1 = require("zod");
const reviewsZodSchema = zod_1.z.object({
    user: zod_1.z.string(),
    review: zod_1.z.string(),
});
const bookZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        author: zod_1.z.string({ required_error: "Author is required" }),
        genre: zod_1.z.string({ required_error: "Genre is required" }),
        publicationDate: zod_1.z.string({
            required_error: "Publication Date is required",
        }),
        createdBy: zod_1.z.string({ required_error: "Created by is required" }),
        ratings: zod_1.z.number().optional(),
        reviews: zod_1.z.array(reviewsZodSchema).optional(),
        bookImage: zod_1.z.string().optional(),
    }),
});
const editBookZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        publicationDate: zod_1.z.string().optional(),
        // ratings: z.number().optional(),
        // reviews: z.array(reviewsZodSchema).optional(),
        bookImage: zod_1.z.string().optional(),
    }),
});
exports.BookValidation = {
    bookZodSchema,
    editBookZodSchema
};
