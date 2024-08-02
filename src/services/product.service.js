"use strict";
// import { product, clothing, electronic, furniture } from "../models/product.model.js";
import productModel from "../models/product.model.js";
import { BadRequestError } from "../core/error.response.js";
import {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProduct,
  findAllProducts,
  findProduct,
  updateProductById,
} from "../models/repositories/product.repo.js";
import {
  removeUndefinedObject,
  updateNestedObjectParser,
} from "../utils/index.js";
import { insertInventory } from "../models/repositories/inventory.repo.js";
import { pushNotiToSystem } from "./notification.service.js";
class ProductFactory {
  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case "Clothing":
  //       return new Clothing(payload).createProduct();
  //     case "Electronic":
  //       return new Electronic(payload).createProduct();
  //     default:
  //       throw new BadRequestError(`Failed to create new product with type: ${type}`);
  //   }
  // }
  static productRegistry = {};

  static registerProductType(type, classRefer) {
    this.productRegistry[type] = classRefer;
  }

  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(
        `Failed to create new product with type: ${type}`
      );
    }
    return new productClass(payload).createProduct();
  }
  static async updateProduct(type, product_id, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(
        `Failed to create new product with type: ${type}`
      );
    }
    return new productClass(payload).updateProduct(product_id);
  }

  static async findAllDraftsProduct({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }
  static async findAllPublishProduct({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_price",
        "product_thumb",
        "product_shop",
      ],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  }
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  static async searchProduct({ keySearch }) {
    return await searchProduct({ keySearch });
  }
}

class Product {
  constructor({
    product_name,
    product_description,
    product_price,
    product_quantity,
    product_thumb,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_thumb = product_thumb;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(product_id) {
    const newProduct = await productModel.product.create({
      ...this,
      _id: product_id,
    });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    pushNotiToSystem({
      type: "SHOP-001",
      receivedId: 1,
      senderId: this.product_shop,
      options: {
        product_name: this.product_name,
        shop_name: this.product_shop,
      },
    })
      .then((rs) => console.log(rs))
      .catch(console.error);
    return newProduct;
  }
  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({
      product_id,
      bodyUpdate,
      model: productModel.product,
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    console.log(this);
    const newClothing = await productModel.clothing.create(
      this.product_attributes
    );
    if (!newClothing) {
      throw new BadRequestError("Create new clothing failed");
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }
    return newProduct;
  }
  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        objectParams: updateNestedObjectParser(objectParams.product_attributes),
        model: productModel.clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await productModel.electronic.create(
      this.product_attributes
    );
    if (!newElectronic) {
      throw new BadRequestError("Create new electronic failed");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await productModel.furniture.create(
      this.product_attributes
    );
    if (!newFurniture) {
      throw new BadRequestError("Create new furniture failed");
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }
    return newProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

export default ProductFactory;
