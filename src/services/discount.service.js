"use strict";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import discountModel from "../models/discount.model.js";
import {
  checkDiscountExists,
  findAllDiscountCodeUnselect,
} from "../models/repositories/discount.repo.js";
import { findAllProducts } from "../models/repositories/product.repo.js";
import { convertToObjectIdMongoDB } from "../utils/index.js";

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      isActive,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      user_used,
    } = payload;
    // if (new Date() > new Date(end_date) || new Date() < new Date(start_date)) {
    // throw new BadRequestError("Discount code has been expired");
    // }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Day is not valid");
    }
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active === true) {
      throw new BadRequestError("Discount already exists!");
    }
    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_value: max_value,
      discount_uses_count: uses_count,
      discount_users_used: user_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: isActive,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
    return newDiscount;
  }

  static async getAllProductWithDiscountCode({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        shopeId: convertToObjectIdMongoDB(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoDB(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: "product_name",
      });
    }
    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: "product_name",
      });
    }
    return products;
  }

  static async getAllDiscountsByShop({ shopId, limit, page }) {
    const discounts = await findAllDiscountCodeUnselect({
      filter: {
        discount_shopId: convertToObjectIdMongoDB(shopId),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      unselect: ["__v", "discount_shopId"],
      model: discountModel,
    });
    return discounts;
  }

  static async getDiscountAmount({ codeId, shopId, userId, products }) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      },
      model: discountModel,
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount not found");
    }
    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) {
      throw new NotFoundError("Discount is not available");
    }
    if (!discount_max_uses) {
      throw new NotFoundError("Discount full of used");
    }
    if (
      new Date() > new Date(discount_end_date) ||
      newDate() < new Date(discount_start_date)
    ) {
      throw new NotFoundError("Discount has been expired");
    }
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.product_quantity * product.product_price;
      }, 0);
    }
    let amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });
    return deleted;
  }
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Not found discount");
    }
    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

export default DiscountService;
