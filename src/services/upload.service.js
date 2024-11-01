"use strict";
import cloudinary from "../configs/cloudinary.config.js";
import {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "../configs/s3.config.js";
import crypto from "crypto";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
// Upload by url
const randomImageName = () => crypto.randomBytes(16).toString("hex");

const uploadFileFromUrl = async () => {
  try {
    const image_url = `data:image/webp;base64,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`;
    const folderName = "product/shopId",
      newFileName = "testUploadByUrl";
    const result = await cloudinary.uploader.upload(image_url, {
      puvlic_id: newFileName,
      folder: folderName,
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    console.log(result);
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.error(error);
  }
};

const uploadImageFromLocalFiles = async ({
  files,
  folderName = "product/8409",
}) => {
  try {
    if (!files.length) {
      return;
    }
    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });
      uploadedUrls.push({
        image_url: result.secure_url,
        shopId: 8409,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      });
    }
    return uploadedUrls;
  } catch (error) {
    console.error(error);
  }
};

const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const imageName = randomImageName();
    const urlImagePublic = process.env.AWS_CLOUD_FRONT_URL;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });
    const result = await s3.send(command);
    // const signedUrl = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: imageName,
    // });
    // const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
    const url = getSignedUrl({
      url: `${urlImagePublic}/${imageName}`,
      keyPairId: process.env.AWS_CLOUD_FRONT_PUBLIC_KEY,
      dateLessThan: new Date(Date.now() + 1000 * 60),
      privateKey: process.env.AWS_BUCKET_PRIVATE_KEY,
    });

    return {
      url,
      result,
    };
  } catch (error) {
    console.error(error);
  }
};

export {
  uploadFileFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
  uploadImageFromLocalS3,
};
