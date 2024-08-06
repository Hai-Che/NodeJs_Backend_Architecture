"use strict";
import { uploadImageFromUrl } from "../services/upload.service.js";

import { SuccessResponse } from "../core/success.response.js";
class UploadController {
  uploadImageFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: "uploadImageFromUrl success",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };
}

export default new UploadController();
