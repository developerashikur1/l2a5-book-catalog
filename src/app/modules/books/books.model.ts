import { model, Schema } from "mongoose";
import { BookModel, IBook } from "./books.interface";

export const BookSchema = new Schema<IBook, BookModel>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ratings: {
      type: Number,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        review: String,
      },
    ],

    bookImage: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Book = model<IBook, BookModel>("Book", BookSchema);
