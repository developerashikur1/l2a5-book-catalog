"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const books_controller_1 = require("./books.controller");
const books_validation_1 = require("./books.validation");
const router = express_1.default.Router();
router.get("/search-options", books_controller_1.BookController.getSearchOptions);
router.get("/:id", books_controller_1.BookController.getSingleBook);
router.delete("/:id", books_controller_1.BookController.deleteBook);
router.patch("/:id", books_controller_1.BookController.commentOnBook);
router.post("/create-book", (0, validateRequest_1.default)(books_validation_1.BookValidation.bookZodSchema), books_controller_1.BookController.createBook);
router.get("/", books_controller_1.BookController.getAllBook);
exports.BookRoutes = router;
