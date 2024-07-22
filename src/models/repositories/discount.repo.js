"use strict";

import { getSelectData, unGetSelectData } from "../../utils/index.js";

const findAllDiscountCodeSelect = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documents;
};

const findAllDiscountCodeUnselect = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  model,
  unselect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unselect))
    .lean();
  return documents;
};

const checkDiscountExists = async ({ filter, model }) => {
  return await model.findOne(filter).lean();
};

export {
  findAllDiscountCodeUnselect,
  findAllDiscountCodeSelect,
  checkDiscountExists,
};
