import express from "express";
import checkoutController from "../../controllers/checkout.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));
// router.use(authenticationV2); // authentication

export default router;
