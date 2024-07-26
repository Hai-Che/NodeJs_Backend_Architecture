"use strict";
import { convertToObjectIdMongoDB } from "../../utils/index.js";
import cartModel from "../cart.model.js";
const findCartById = async (cartId) => {
  const foundCart = await cartModel.findOne({
    _id: convertToObjectIdMongoDB(cartId),
    cart_state: "active",
  });
  return foundCart;
};

export { findCartById };
