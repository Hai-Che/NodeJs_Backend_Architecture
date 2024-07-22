"use strict";
import mongoose, { Types } from "mongoose";

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "pending", "failed", "completed"],
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    timeseries: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, cartSchema);
