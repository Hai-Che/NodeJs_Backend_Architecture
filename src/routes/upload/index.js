import express from "express";
import uploadController from "../../controllers/upload.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { uploadDisk } from "../../configs/multer.config.js";
// import { authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();

// router.use(authenticationV2); // authentication

router.post("/product", asyncHandler(uploadController.uploadFileFromUrl));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);

export default router;
