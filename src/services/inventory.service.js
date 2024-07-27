"use strict";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import inventoryModel from "../models/inventory.model.js";
import { findProductById } from "../models/repositories/product.repo.js";

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "134, Tran Phu, HCM City",
  }) {
    const product = await findProductById(productId);
    if (!product) {
      throw new BadRequestError("Product not found");
    }
    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = {
        new: true,
        upsert: true,
      };
    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

export default InventoryService;
