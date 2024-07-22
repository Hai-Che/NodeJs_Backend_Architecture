"use strict";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import cartModel from "../models/cart.model.js";

class CartService {
  static async createUserCart({ userId, product }) {
    const query = {
        cart_userId: userId,
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      return await this.createUserCart({ userId, product });
    }
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    return await this.updateUserCartQuantity({ userId, product });
  }
}

export default CartService;
