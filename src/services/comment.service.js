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

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);
      if (!parent) {
        throw new NotFoundError("Parent comment not found");
      }
      const comments = await commentModel
        .find({
          comment_productId: convertToObjectIdMongoDB(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_parentId: 1,
          comment_content: 1,
        })
        .sort({
          comment_left: 1,
        });
      return comments;
    }
    const comments = await commentModel
      .find({
        comment_productId: convertToObjectIdMongoDB(productId),
        comment_parentId: parentCommentId,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_parentId: 1,
        comment_content: 1,
      })
      .sort({
        comment_left: 1,
      });
    return comments;
  }
}

export default CommentService;
