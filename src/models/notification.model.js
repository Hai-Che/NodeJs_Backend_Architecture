"use strict";
import mongoose, { Types } from "mongoose";

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const notificationSchema = new mongoose.Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "SHOP-001", "PROMOTION-001"],
      required: true,
    },
    noti_senderId: { type: Types.ObjectId, ref: "Shop", required: true },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, notificationSchema);
