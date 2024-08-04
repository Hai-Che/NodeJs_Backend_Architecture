"use strict";
const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");
// const log = console.log;
// console.log = function () {
//   log.apply(console, [new Date()].concat(arguments));
// };
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
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      const notiQueue = "notificationQueueProcess";
      // 1. TTL
      // setTimeout(() => {
      //   channel.consume(notiQueue, (msg) => {
      //     console.log(`Received msg from producer: `, msg.content.toString());
      //     channel.ack(msg);
      //   });
      // }, 15000);
      // 2. Error msg
      channel.consume(notiQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });
          if (numberTest < 0.5) {
            throw new Error("Wrong input message, need to hot fixed");
          }
          console.log(`Received msg from producer: `, msg.content.toString());
          channel.ack(msg);
        } catch (error) {
          // console.error(error);
          channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  consumerToQueueFailed: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      const notificationExchangeDLX = "notificationExDLX";
      const notificationRoutingKey = "notificationRoutingKeyDLX";
      const notiQueueHandler = "notificationQueueHotFix";
      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });
      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false,
      });
      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKey
      );
      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            `This notification error, pls hot fix: `,
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = messageService;
