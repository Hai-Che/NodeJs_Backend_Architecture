"use strict";
import mongoose, { Schema, Types } from "mongoose";
import slugify from "slugify";
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_slug: {
      type: String,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      refer: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    productRatingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be under 5.0"],
      set: (val) => {
        Math.round(val * 10) / 10;
      },
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
productSchema.index({ product_name: "text", product_description: "text" });
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "clothes",
  }
);

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "electronic",
  }
);

const furnitureSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "furniture",
  }
);

export default {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  clothing: mongoose.model("Clothing", clothingSchema),
  electronic: mongoose.model("Electronic", electronicSchema),
  furniture: mongoose.model("Furniture", furnitureSchema),
};
