import express from "express";
import cartController from "../../controllers/cart.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
// import { authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteCart));
// router.use(authenticationV2); // authentication

router.post("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.getListUserCart));

export default router;
