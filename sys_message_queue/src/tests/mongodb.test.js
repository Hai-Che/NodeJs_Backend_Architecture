"use strict";

const mongoose = require("mongoose");
const connectString = "mongodb://localhost:27017/shopDEV";

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", TestSchema);

describe("Mongoose connection", () => {
  let connection;
  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });
  afterAll(async () => {
    await connection.disconnect();
  });
  it("should connect to mongo", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
  it("should save a document to database", async () => {
    const user = new Test({ name: "new Test" });
    await user.save();
    expect(user.isNew).toBe(false);
  });
  it("should find a exact user", async () => {
    const user = await Test.findOne({ name: "new Test" });
    expect(user).toBeDefined();
    expect(user.name).toBe("new Test");
  });
});
