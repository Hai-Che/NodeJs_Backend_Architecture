"use strict";
import ProductFactory from "../services/product.service.js";
// import productService from "../services/product.service.js";

import { SuccessResponse } from "../core/success.response.js";
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Registered Success",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Updated Success",
      metadata: await ProductFactory.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Published Success",
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublished Success",
      metadata: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  //Query
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get drafts list success!",
      metadata: await ProductFactory.findAllDraftsProduct({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get publish list success!",
      metadata: await ProductFactory.findAllPublishProduct({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all products success!",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };
  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product success!",
      metadata: await ProductFactory.findAllProducts(req.params),
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search success!",
      metadata: await ProductFactory.searchProduct(req.params),
    }).send(res);
  };
}

export default new ProductController();
