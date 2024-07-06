"use strict";

import mongoose from "mongoose";
import "dotenv/config";
import configMongodb from "../configs/config.mongodb.js";

const { host, port, name } = configMongodb.db;
const MONGODB_URL = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(MONGODB_URL)
      .then((_) => {
        console.log("Connect to mongodb successfully");
      })
      .catch((err) => console.log(err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongoDB = Database.getInstance();
export default instanceMongoDB;
