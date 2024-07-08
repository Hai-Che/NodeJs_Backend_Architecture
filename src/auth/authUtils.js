"use strict";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler.js";
import { AuthorizedFailure, NotFoundError } from "../core/error.response.js";
import keyTokenService from "../services/keyToken.service.js";
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESH_TOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`verify error: `, err);
      } else {
        console.log(`verify decode: `, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error in here");
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthorizedFailure("Invalid request");
  }
  const keyStore = await keyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found keystore");
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthorizedFailure("Invalid request");
  }
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthorizedFailure("Invalid user id");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthorizedFailure("Invalid request");
  }
  const keyStore = await keyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found keystore");
  }
  try {
    const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
    if (userId !== decodeUser.userId) {
      throw new AuthorizedFailure("Invalid user id");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    req.refreshToken = refreshToken;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, secret_key) => {
  return await jwt.verify(token, secret_key);
};

export { createTokenPair, authentication, verifyJWT, authenticationV2 };
