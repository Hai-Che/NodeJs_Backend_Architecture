"use strict";
import { listNotiByUser } from "../services/notification.service.js";

import { SuccessResponse } from "../core/success.response.js";
class CommentController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "listNotiByUser success",
      metadata: await listNotiByUser(req.query),
    }).send(res);
  };
}

export default new CommentController();
