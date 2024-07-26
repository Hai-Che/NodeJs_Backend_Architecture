"use strict";
import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { findCartById } from "../models/repositories/cart.repo.js";
import { checkProductByServer } from "../models/repositories/product.repo.js";
import DiscountService from "./discount.service.js";

class CheckoutService {
  static async checkoutReview({ userId, cartId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      console.log("go here");
      return new NotFoundError("Cart not found");
    }
    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      new_shop_order_ids = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const foundProduct = await checkProductByServer(item_products);
      if (!foundProduct[0]) {
        return new BadRequestError("Wrong order");
      }
      const checkoutPrice = foundProduct.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        item_products: foundProduct,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
      };
      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            shopId,
            userId,
            products: foundProduct,
          });
        checkout_order.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      new_shop_order_ids.push(itemCheckout);
    }
    return {
      new_shop_order_ids,
      shop_order_ids,
      checkout_order,
    };
  }
}

export default CheckoutService;
