"use strict";
import {
  uploadFileFromUrl,
  uploadFileThumb,
} from "../services/upload.service.js";

import { SuccessResponse } from "../core/success.response.js";
import { BadRequestError } from "../core/error.response.js";
class UploadController {
  uploadFileFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: "uploadImageFromUrl success",
      metadata: await uploadFileFromUrl(),
    }).send(res);
  };
  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "uploadFileThumb success",
      metadata: await uploadFileThumb({
        path: file.path,
      }),
    }).send(res);
  };
}

export default new UploadController();
