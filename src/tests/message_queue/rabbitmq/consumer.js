import amqp from "amqplib";

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "test topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.consume(
      queueName,
      (msg) => {
        console.log(msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

runConsumer().catch(console.error);
