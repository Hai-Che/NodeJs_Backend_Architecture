"use strict";

import amqp from "amqplib";

const consumerOrderedMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "ordered_queue_message";
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.prefetch(1);
    channel.consume(queueName, (msg) => {
      const message = msg.content.toString();
      setTimeout(() => {
        console.log(`Process: ${message}`);
        channel.ack(msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.error(error);
  }
};

consumerOrderedMessage().catch(console.error);
