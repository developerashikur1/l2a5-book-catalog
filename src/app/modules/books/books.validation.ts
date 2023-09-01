import { z } from "zod";

const reviewsZodSchema = z.object({
  user: z.string(),
  review: z.string(),
});

const bookZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    author: z.string({ required_error: "Author is required" }),
    genre: z.string({ required_error: "Genre is required" }),
    publicationDate: z.string({
      required_error: "Publication Date is required",
    }),
    createdBy: z.string({ required_error: "Created by is required" }),
    ratings: z.number().optional(),
    reviews: z.array(reviewsZodSchema).optional(),
    bookImage: z.string().optional(),
  }),
});

export const BookValidation = {
  bookZodSchema,
};
