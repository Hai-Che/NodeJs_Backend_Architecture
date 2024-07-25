"use strict";
import DiscountService from "../services/discount.service.js";

import { SuccessResponse } from "../core/success.response.js";
class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Created discount code success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "getAllDiscountCode success",
      metadata: await DiscountService.getAllDiscountsByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "getDiscountAmount success",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "getDiscountAmount success",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
  getAllProductWithDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "getAllProductWithDiscountCode success",
      metadata: await DiscountService.getAllProductWithDiscountCode({
        ...req.query,
      }),
    }).send(res);
  };
}

export default new DiscountController();
