import shopModel from "../models/shop.model.js";

const findByEmail = async ({
  email,
  select = {
    name: 1,
    email: 1,
    password: 1,
    status: 1,
    roles: 1,
  },
}) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

export { findByEmail };