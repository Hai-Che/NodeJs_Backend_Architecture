import express from "express";
import accessRoute from "./access/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";

const router = express.Router();
//Check api key
router.use(apiKey);
//Check permission
router.use(permission("0000"));
router.use("/v1/api", accessRoute);

export default router;
