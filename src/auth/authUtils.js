"use strict";
import jwt from "jsonwebtoken";
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

export { createTokenPair };
