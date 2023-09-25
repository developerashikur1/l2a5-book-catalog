import { Model, Types } from "mongoose";

export type IReview = {
  user?: Types.ObjectId;
  review?: string;
};

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  createdBy: Types.ObjectId;
  ratings?: number | null;
  reviews?: IReview[];
  bookImage?: string;
  
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: string;
};
