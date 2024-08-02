import express from "express";
import commentController from "../../controllers/comment.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();

router.use(authenticationV2); // authentication

router.post("", asyncHandler(commentController.createComment));
router.get("", asyncHandler(commentController.getCommentsByParentId));

export default router;
