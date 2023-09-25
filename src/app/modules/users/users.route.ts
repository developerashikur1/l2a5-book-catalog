import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./users.controller";
import { UserValidation } from "./users.validation";

const router = express.Router();

router.put(
    "/wish-list",
    validateRequest(UserValidation.addToWishList),
  UserController.addToWishList,
);
router.put(
    "/reading-list",
    validateRequest(UserValidation.addToWishList),
  UserController.addToReadingList,
);
router.put(
    "/finished-list",
    validateRequest(UserValidation.addToWishList),
  UserController.addToFinishedList,
);
router.put(
    "/remove-list",
    validateRequest(UserValidation.addToWishList),
  UserController.removeFromFinishedList,
);

router.get(
    "/profile",
  UserController.getProfile,
);

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


router.post("/signout", UserController.signOutUser);

export const UserRoutes = router;
