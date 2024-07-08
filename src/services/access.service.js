"use strict";
import shopModel from "../models/shop.model.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import keyTokenService from "./keyToken.service.js";
import { createTokenPair, verifyJWT } from "../auth/authUtils.js";
import { getInfoData } from "../utils/index.js";
import { AuthorizedFailure, BadRequestError } from "../core/error.response.js";
import { findByEmail } from "./shop.service.js";
import { access } from "node:fs";
const ROLESHOP = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITER: "EDITER",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderShop = await findByEmail({ email });
    if (holderShop) {
      throw new BadRequestError("Email already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [ROLESHOP.SHOP],
    });
    if (newShop) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      const keyStore = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("fail to create keyStore");
      }
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError(`shop isn't exist`);
    }
    const passwordCheck = await bcrypt.compare(password, foundShop.password);
    if (!passwordCheck) {
      throw new AuthorizedFailure("Authenticated error");
    }
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await keyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  static handleRefreshToken = async (refreshToken) => {
    const foundRefreshToken = await keyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundRefreshToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundRefreshToken.privateKey
      );
      console.log(userId, email);
      await keyTokenService.deleteKeyById(userId);
      throw new BadRequestError("Forbidden");
    }
    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthorizedFailure("token not valid");
    }
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log(userId, email);
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthorizedFailure("Not registered");
    }
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: {
        userId,
        email,
      },
      tokens,
    };
  };

  static handleRefreshTokenV2 = async ({ user, refreshToken, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await keyTokenService.deleteKeyById(userId);
      throw new BadRequestError("Forbidden");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthorizedFailure("Shop is not registered");
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthorizedFailure("Not registered");
    }
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  };
}

export default AccessService;
