import mongoose from "mongoose";
import { z } from "zod";

const signUpZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
    phone: z.string({ required_error: "Phone is required" }),
    address: z.string({ required_error: "Address is required" }),
    profession: z.string().optional(),
    profileImage: z.string().optional(),
    wishlist: z
      .array(
        z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: "Invalid ObjectId",
        })
      )
      .optional(),
    readingList: z
      .array(
        z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: "Invalid ObjectId",
        })
      )
      .optional(),
      finishedList: z
      .array(
        z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: "Invalid ObjectId",
        })
      )
      .optional(),
  }),
});

const signInZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const addToWishList = z.object({
  body: z.object({
    bookId: z.string({ required_error: "BookId is required" }),
  }),
});

export const UserValidation = {
  signUpZodSchema,
  signInZodSchema,
  addToWishList,
};
