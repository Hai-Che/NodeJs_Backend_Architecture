"use strict";
const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      await consumerQueue(queueName, channel);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

module.exports = messageService;
