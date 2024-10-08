import express from "express";
import accessRoute from "./access/index.js";
import productRoute from "./product/index.js";
import discountRoute from "./discount/index.js";
import cartRoute from "./cart/index.js";
import checkoutRoute from "./checkout/index.js";
import inventoryRoute from "./inventory/index.js";
import commentRoute from "./comment/index.js";
import notificationRoute from "./notification/index.js";
import uploadRouter from "./upload/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";

const router = express.Router();
//Check api key
router.use(apiKey);
//Check permission
router.use(permission("0000"));
router.use("/v1/api/product", productRoute);
router.use("/v1/api/checkout", checkoutRoute);
router.use("/v1/api/discount", discountRoute);
router.use("/v1/api/inventory", inventoryRoute);
router.use("/v1/api/cart", cartRoute);
router.use("/v1/api/comment", commentRoute);
router.use("/v1/api/notification", notificationRoute);
router.use("/v1/api/upload", uploadRouter);
router.use("/v1/api", accessRoute);

export default router;
