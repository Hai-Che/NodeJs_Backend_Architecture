"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) {
      throw new Error("Failed to connect to rabbitmq database");
    }
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.log(error);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();
    const queue = "test-queue";
    const message = "test message";
    await channel.assertQueue(queue, {
      durable: true,
    });
    await channel.sendToQueue(queue, Buffer.from(message));
    await connection.close();
  } catch (error) {
    console.log(error);
  }
};

const consumerQueue = async (queueName, channel) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for message ...`);
    channel.consume(
      queueName,
      (msg) => {
        console.log(
          `Received message from queue: ${queueName} with content: `,
          msg.content.toString()
        );
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest, consumerQueue };
