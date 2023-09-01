import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BookController } from "./books.controller";
import { BookValidation } from "./books.validation";

const router = express.Router();

router.get("/:id", BookController.getSingleBook);
router.delete("/:id", BookController.deleteBook);
router.patch("/:id", BookController.commentOnBook);

router.post(
  "/create-book",
  validateRequest(BookValidation.bookZodSchema),
  BookController.createBook
);

router.get("/", BookController.getAllBook);

export const BookRoutes = router;
