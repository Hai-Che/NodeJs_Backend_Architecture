"use strict";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import commentModel from "../models/comment.model.js";
import { convertToObjectIdMongoDB } from "../utils/index.js";

class CommentService {
  static async createComment({
    userId,
    productId,
    content,
    parentCommentId = null,
  }) {
    const comment = new commentModel({
      comment_userId: userId,
      comment_productId: productId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });
    let rightValue;
    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError("Parent comment not found");
      }
      rightValue = parentComment.comment_right;
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongoDB(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongoDB(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: convertToObjectIdMongoDB(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      console.log(maxRightValue);
      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }
    }
    console.log(rightValue);
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }
}

export default CommentService;
