"use strict";
import CommentService from "../services/comment.service.js";

import { SuccessResponse } from "../core/success.response.js";
class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "createComment success",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };
  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "getCommentsByParentId success",
      metadata: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  };
}

export default new CommentController();
