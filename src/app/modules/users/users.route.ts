import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./users.controller";
import { UserValidation } from "./users.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.signUpZodSchema),
  UserController.signUpUser
);

router.post(
  "/signin",
  validateRequest(UserValidation.signInZodSchema),
  UserController.signInUser
);

export const UserRoutes = router;
