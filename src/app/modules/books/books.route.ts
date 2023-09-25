import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BookController } from "./books.controller";
import { BookValidation } from "./books.validation";

const router = express.Router();

router.get("/search-options", BookController.getSearchOptions);

router.get("/:id", BookController.getSingleBook);
router.delete("/:id", BookController.deleteBook);
router.put("/:id", BookController.commentOnBook);
router.patch(
  "/:id",
  validateRequest(BookValidation.editBookZodSchema),
  BookController.editBook
);

router.post(
  "/create-book",
  validateRequest(BookValidation.bookZodSchema),
  BookController.createBook
);

router.get("/", BookController.getAllBook);

export const BookRoutes = router;
