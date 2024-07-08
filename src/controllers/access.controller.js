"use strict";

import AccessService from "../services/access.service.js";
import { CREATED, SuccessResponse } from "../core/success.response.js";
class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered Success",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login Success",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Tokens Success",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
  handleRefreshTokenV2 = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Tokens Success",
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

export default new AccessController();
