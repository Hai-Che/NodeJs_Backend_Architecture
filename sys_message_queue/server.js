"use strict";

const { consumerToQueue } = require("./src/services/consumerQueue.service");

const queueName = "test topic";

consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer started with queue: ${queueName}`);
  })
  .catch((err) => console.log(err.message));
