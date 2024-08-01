// import { Types } from "mongoose";
// import { create } from "lodash";
import { convertToObjectIdMongoDB } from "../../utils/index.js";
import inventoryModel from "../inventory.model.js";

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongoDB(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: { inven_stock: -quantity },
      $push: {
        inven_reservation: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = {
      new: true,
      upsert: true,
    };
  return await inventoryModel.updateOne(query, updateSet, options);
};

export { insertInventory, reservationInventory };
