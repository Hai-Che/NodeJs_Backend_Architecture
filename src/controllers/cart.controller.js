"use strict";
import CartService from "../services/cart.service.js";

import { SuccessResponse } from "../core/success.response.js";
class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "addToCart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };
  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "updateCart success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };
  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: "deleteCart success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };
  getListUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: "getListUserCart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

export default new CartController();
