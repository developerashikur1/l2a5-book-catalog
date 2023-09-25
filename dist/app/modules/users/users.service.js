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
const addToWishList = (bookId, token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    // checking authorization part and separate the Bearer fro authorization token
    try {
        const partsToken = token.split(" ");
        if (partsToken.length === 2) {
            let scheme = partsToken[0];
            token = partsToken[1];
            if (/^Bearer$/i.test(scheme)) {
                verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_token);
            }
        }
        if (!verifiedToken) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
        }
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
    }
    const { userEmail, userPhone, user } = verifiedToken;
    const result = yield users_model_1.User.findByIdAndUpdate(user, {
        $push: {
            wishlist: bookId
        }
    });
    return result;
});
const addToReadingList = (bookId, token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        const partsToken = token.split(" ");
        if (partsToken.length === 2) {
            let scheme = partsToken[0];
            token = partsToken[1];
            if (/^Bearer$/i.test(scheme)) {
                verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_token);
            }
        }
        if (!verifiedToken) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
        }
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
    }
    const { userEmail, userPhone, user } = verifiedToken;
    // hare we at first moving book from wishlist to readinglist.
    let result = null;
    try {
        const result1 = yield users_model_1.User.findByIdAndUpdate(user, { $pull: { wishlist: bookId } });
        if (result1) {
            result = yield users_model_1.User.findByIdAndUpdate(user, { $push: { readingList: bookId } }).populate('wishlist').populate('readingList').populate('finishedList');
        }
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_MODIFIED, 'Readinglist not modified!');
    }
    return result;
});
const addToFinishedList = (bookId, token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        const partsToken = token.split(" ");
        if (partsToken.length === 2) {
            let scheme = partsToken[0];
            token = partsToken[1];
            if (/^Bearer$/i.test(scheme)) {
                verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_token);
            }
        }
        if (!verifiedToken) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
        }
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
    }
    const { userEmail, userPhone, user } = verifiedToken;
    // hare we are removing book from readinglist to finishedlist
    let result = null;
    try {
        const result1 = yield users_model_1.User.findByIdAndUpdate(user, { $pull: { readingList: bookId } });
        if (result1) {
            result = yield users_model_1.User.findByIdAndUpdate(user, { $push: { finishedList: bookId } }).populate('wishlist').populate('readingList').populate('finishedList');
        }
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_MODIFIED, 'Finishedlist not modified!');
    }
    return result;
});
const removeFromFinishedList = (bookId, token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        const partsToken = token.split(" ");
        if (partsToken.length === 2) {
            let scheme = partsToken[0];
            token = partsToken[1];
            if (/^Bearer$/i.test(scheme)) {
                verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_token);
            }
        }
        if (!verifiedToken) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
        }
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
    }
    const { userEmail, userPhone, user } = verifiedToken;
    // deleting book id from finishedlist
    let result = null;
    try {
        result = yield users_model_1.User.findByIdAndUpdate(user, { $pull: { finishedList: bookId } });
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_MODIFIED, 'Finishedlist not modified!');
    }
    return result;
});
const getProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        const partsToken = token.split(" ");
        if (partsToken.length === 2) {
            let scheme = partsToken[0];
            token = partsToken[1];
            if (/^Bearer$/i.test(scheme)) {
                verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_token);
            }
        }
        if (!verifiedToken) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
        }
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token.");
    }
    const { userEmail, userPhone, user } = verifiedToken;
    const result = yield users_model_1.User.findById(user).populate('wishlist').populate('readingList').populate('finishedList');
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
    // hare we are checking the password is matched or not
    if (!isPasswordMatched) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect!");
    }
    const { email: userEmail, phone: userPhone, _id: user } = isUserExist;
    // hare we are creating accesstoken
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ user, userEmail, userPhone }, config_1.default.jwt.access_token, config_1.default.jwt.access_expires_in);
    // hare we are creating refreshtoken
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ user, userEmail, userPhone }, config_1.default.jwt.refresh_token, config_1.default.jwt.refresh_expires_in);
    const userInfo = yield users_model_1.User.findById(user).populate('wishlist').populate('readingList').populate('finishedList');
    return {
        accessToken,
        refreshToken,
        userInfo,
    };
});
exports.UserService = {
    addToWishList,
    signUpUser,
    signInUser,
    getProfile,
    addToReadingList,
    addToFinishedList,
    removeFromFinishedList,
};
