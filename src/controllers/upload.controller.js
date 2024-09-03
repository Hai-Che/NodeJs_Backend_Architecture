"use strict";
import {
  uploadFileFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
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
  uploadImageFromLocal = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "uploadFileThumb success",
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };
  uploadImageFromLocalFiles = async (req, res, next) => {
    const { files } = req;
    if (!files.length) {
      throw new BadRequestError("Files missing");
    }
    new SuccessResponse({
      message: "uploadImageFromLocalFiles success",
      metadata: await uploadImageFromLocalFiles({
        files,
      }),
    }).send(res);
  };
}

export default new UploadController();
