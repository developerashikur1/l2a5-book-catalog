"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const users_model_1 = require("./users.model");
const signUpUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_model_1.User.create(userData);
    return result;
});
const signInUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //   const result = await User.create(userData);
    const { email, password } = payload;
    const isUserExist = yield users_model_1.User.isUserExist(email);
    if (!isUserExist) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    const isPasswordMatched = yield users_model_1.User.isPasswordMatched(password, isUserExist.password);
    if (!isPasswordMatched) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect!");
    }
    const { email: userEmail, phone: userPhone, _id: user } = isUserExist;
    //   create access & refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ user, userEmail, userPhone }, config_1.default.jwt.access_token, config_1.default.jwt.access_expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ user, userEmail, userPhone }, config_1.default.jwt.refresh_token, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.UserService = {
    signUpUser,
    signInUser,
};
