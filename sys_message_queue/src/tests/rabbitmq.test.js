"use strict";
const { connectToRabbitMQForTest } = require("../dbs/init.rabbit.js");

describe("Connect to rabbitMq", () => {
  it("Connect to rabbitMa successful", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
