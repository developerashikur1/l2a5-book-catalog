import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { ILoginUser, IUser, IUserLoginResponse } from "./users.interface";
import { User } from "./users.model";

const signUpUser = async (userData: IUser): Promise<IUser> => {
  const result = await User.create(userData);

  return result;
};

const addToWishList = async (bookId: string, token: string): Promise<IUser | null> => {
    let verifiedToken = null;

    // checking authorization part and separate the Bearer fro authorization token
    try {
      const partsToken = token.split(" ");
      if (partsToken.length === 2) {
        let scheme = partsToken[0];
        token = partsToken[1];
  
        if (/^Bearer$/i.test(scheme)) {
          verifiedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.access_token as Secret
          );
        }
      }
  
      if (!verifiedToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
      }
    } catch (error) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
    }
  
    const { userEmail, userPhone, user } = verifiedToken;
  
    
  const result = await User.findByIdAndUpdate(user, {
      $push:{
        wishlist: bookId
      }
  });


  return result;
};

const addToReadingList = async (bookId: string, token: string): Promise<IUser | null> => {
    let verifiedToken = null;

    try {
      const partsToken = token.split(" ");
      if (partsToken.length === 2) {
        let scheme = partsToken[0];
        token = partsToken[1];
  
        if (/^Bearer$/i.test(scheme)) {
          verifiedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.access_token as Secret
          );
        }
      }
  
      if (!verifiedToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
      }
    } catch (error) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
    }
  
    const { userEmail, userPhone, user } = verifiedToken;
  
    // hare we at first moving book from wishlist to readinglist.
    let result = null;
    try {
        const result1 = await User.findByIdAndUpdate(user, {$pull: {wishlist: bookId}});
        if(result1){
            result = await User.findByIdAndUpdate(user, {$push: {readingList: bookId}}).populate('wishlist').populate('readingList').populate('finishedList');
        }
    } catch (error) {
        throw new ApiError(httpStatus.NOT_MODIFIED, 'Readinglist not modified!')
    }
    return result; 
};

const addToFinishedList = async (bookId: string, token: string): Promise<IUser | null> => {
    let verifiedToken = null;

    try {
      const partsToken = token.split(" ");
      if (partsToken.length === 2) {
        let scheme = partsToken[0];
        token = partsToken[1];
  
        if (/^Bearer$/i.test(scheme)) {
          verifiedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.access_token as Secret
          );
        }
      }
  
      if (!verifiedToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
      }
    } catch (error) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
    }
  
    const { userEmail, userPhone, user } = verifiedToken;
  
    // hare we are removing book from readinglist to finishedlist
    let result = null;
    try {
        const result1 = await User.findByIdAndUpdate(user, {$pull: {readingList: bookId}});
        if(result1){
            result = await User.findByIdAndUpdate(user, {$push: {finishedList: bookId}}).populate('wishlist').populate('readingList').populate('finishedList');
        }
    } catch (error) {
        throw new ApiError(httpStatus.NOT_MODIFIED, 'Finishedlist not modified!')
    }
    return result; 
};

const removeFromFinishedList = async (bookId: string, token: string): Promise<IUser | null> => {
    let verifiedToken = null;

    try {
      const partsToken = token.split(" ");
      if (partsToken.length === 2) {
        let scheme = partsToken[0];
        token = partsToken[1];
  
        if (/^Bearer$/i.test(scheme)) {
          verifiedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.access_token as Secret
          );
        }
      }
  
      if (!verifiedToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
      }
    } catch (error) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
    }
  
    const { userEmail, userPhone, user } = verifiedToken;
  
    // deleting book id from finishedlist
    let result = null;
    try {
        result = await User.findByIdAndUpdate(user, {$pull: {finishedList: bookId}});
    } catch (error) {
        throw new ApiError(httpStatus.NOT_MODIFIED, 'Finishedlist not modified!')
    }
    return result; 
};

const getProfile = async (token: string): Promise<IUser | null> => {
    let verifiedToken = null;

    try {
      const partsToken = token.split(" ");
      if (partsToken.length === 2) {
        let scheme = partsToken[0];
        token = partsToken[1];
  
        if (/^Bearer$/i.test(scheme)) {
          verifiedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.access_token as Secret
          );
        }
      }
  
      if (!verifiedToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
      }
    } catch (error) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
    }
  
    const { userEmail, userPhone, user } = verifiedToken;
  
    
  const result = await User.findById(user).populate('wishlist').populate('readingList').populate('finishedList');

  return result;
};

const signInUser = async (payload: ILoginUser): Promise<IUserLoginResponse> => {
  //   const result = await User.create(userData);

  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isUserExist.password
  );

  // hare we are checking the password is matched or not
  if (!isPasswordMatched) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect!");
    }
    
    const { email: userEmail, phone: userPhone, _id: user } = isUserExist;
    
    // hare we are creating accesstoken
    const accessToken = jwtHelpers.createToken(
        { user, userEmail, userPhone },
        config.jwt.access_token as Secret,
        config.jwt.access_expires_in as string
        );
        
        // hare we are creating refreshtoken
  const refreshToken = jwtHelpers.createToken(
    { user, userEmail, userPhone },
    config.jwt.refresh_token as Secret,
    config.jwt.refresh_expires_in as string
  );

  const userInfo = await User.findById(user).populate('wishlist').populate('readingList').populate('finishedList');

  return {
    accessToken,
    refreshToken,
    userInfo,
  };
};


export const UserService = {
  addToWishList,
  signUpUser,
  signInUser,
  getProfile,
  addToReadingList,
  addToFinishedList,
  removeFromFinishedList,
};
