"use strict";

const {
  consumerToQueue,
  consumerToQueueFailed,
  consumerToQueueNormal,
} = require("./src/services/consumerQueue.service");

const queueName = "test topic";

// consumerToQueue(queueName)
//   .then(() => {
//     console.log(`Message consumer started with queue: ${queueName}`);
//   })
//   .catch((err) => console.log(err.message));

consumerToQueueNormal(queueName)
  .then(() => {
    console.log(`Message consumer started with queue`);
  })
  .catch((err) => console.log(err.message));

consumerToQueueFailed(queueName)
  .then(() => {
    console.log(`Message consumer started with queue`);
  })
  .catch((err) => console.log(err.message));
