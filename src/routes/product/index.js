import express from "express";
import productController from "../../controllers/product.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();
router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
router.get("/", asyncHandler(productController.getAllProducts));
router.get("/:id", asyncHandler(productController.getProduct));
router.use(authenticationV2); // authentication
router.post("", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);

export default router;
