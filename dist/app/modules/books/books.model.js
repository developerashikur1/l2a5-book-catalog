"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = exports.BookSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BookSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    ratings: {
        type: Number,
    },
    reviews: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
            review: String,
        },
    ],
    bookImage: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Book = (0, mongoose_1.model)("Book", exports.BookSchema);
