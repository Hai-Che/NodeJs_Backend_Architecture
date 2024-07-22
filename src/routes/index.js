import express from "express";
import accessRoute from "./access/index.js";
import productRoute from "./product/index.js";
import discountRoute from "./discount/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";

const router = express.Router();
//Check api key
router.use(apiKey);
//Check permission
router.use(permission("0000"));
router.use("/v1/api/product", productRoute);
router.use("/v1/api/discount", discountRoute);
router.use("/v1/api", accessRoute);

export default router;
