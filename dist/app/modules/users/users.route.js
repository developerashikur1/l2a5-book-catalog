"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const users_controller_1 = require("./users.controller");
const users_validation_1 = require("./users.validation");
const router = express_1.default.Router();
router.put("/wish-list", (0, validateRequest_1.default)(users_validation_1.UserValidation.addToWishList), users_controller_1.UserController.addToWishList);
router.put("/reading-list", (0, validateRequest_1.default)(users_validation_1.UserValidation.addToWishList), users_controller_1.UserController.addToReadingList);
router.put("/finished-list", (0, validateRequest_1.default)(users_validation_1.UserValidation.addToWishList), users_controller_1.UserController.addToFinishedList);
router.put("/remove-list", (0, validateRequest_1.default)(users_validation_1.UserValidation.addToWishList), users_controller_1.UserController.removeFromFinishedList);
router.get("/profile", users_controller_1.UserController.getProfile);
router.post("/signup", (0, validateRequest_1.default)(users_validation_1.UserValidation.signUpZodSchema), users_controller_1.UserController.signUpUser);
router.post("/signin", (0, validateRequest_1.default)(users_validation_1.UserValidation.signInZodSchema), users_controller_1.UserController.signInUser);
router.post("/signout", users_controller_1.UserController.signOutUser);
exports.UserRoutes = router;
