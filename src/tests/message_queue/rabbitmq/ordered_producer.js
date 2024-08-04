"use strict";

import amqp from "amqplib";

const producerOrderedMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "ordered_queue_message";
    await channel.assertQueue(queueName, {
      durable: true,
    });
    for (let i = 0; i < 10; i++) {
      const message = `ordered_queue_message: ${i}`;
      console.log(`Send message from producer: ${message}`);
      channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
    }
    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
};

producerOrderedMessage().catch(console.error);
