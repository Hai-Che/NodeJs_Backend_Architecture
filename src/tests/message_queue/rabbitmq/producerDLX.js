import amqp from "amqplib";

// const log = console.log;
// console.log = function () {
//   log.apply(console, [new Date()].concat(arguments));
// };

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const notificationExchange = "notificationEx";
    const notiQueue = "notificationQueueProcess";
    const notificationExchangeDLX = "notificationExDLX";
    const notificationRoutingKey = "notificationRoutingKeyDLX";
    const msg = "Message for test DLX";

    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKey,
    });

    await channel.bindQueue(queueResult.queue, notificationExchange);

    console.log(`Send message to consumer: `, msg);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000",
    });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
