/* istanbul ignore file */
import amqp, { Connection, Channel } from 'amqplib';

class Queue {
  protected getConnection() {
    return amqp.connect({
      protocol: process.env.AMQP_PROTOCOL,
      hostname: process.env.AMQP_HOST,
      port: (process.env.AMQP_PORT as unknown) as number,
      username: process.env.AMQP_USER,
      password: process.env.AMQP_PASS,
      heartbeat: 10,
    });
  }

  async closeConnection(connection: Connection, channel: Channel) {
    // console.log('FECHANDO')
    if (channel) {
      await channel.close();
    }

    if (connection) {
      await connection.close();
    }
  }

  async sendMessage(
    queueName: string,
    message: any,
    persistente = true,
    ttl?: number
  ) {
    const client = await this.getConnection();

    const channel = await client.createChannel();
    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: persistente,
    });

    await this.closeConnection(client, channel);
  }

  async sendMessageBatch(
    queueName: string,
    messages: any[] = [],
    persistente = true
  ) {
    const client = await this.getConnection();

    const channel = await client.createChannel();
    await channel.assertQueue(queueName);
    await Promise.all(
      messages.map((item) =>
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(item)), {
          persistent: persistente,
        })
      )
    );

    await this.closeConnection(client, channel);
  }
}

export default new Queue()
