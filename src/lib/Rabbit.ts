/* eslint-disable no-console */
/* istanbul ignore file */
import { IWorkerController } from '@app/jobs/IWorkerController';
import amqp, { Connection, Channel } from 'amqplib';

class Queue {
  client: amqp.Connection;

  channel: amqp.Channel;

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

  constructor() {
    this.init();
  }

  async init() {
    this.client = await this.getConnection();

    this.channel = await this.client.createChannel();
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

  async sendMessage(queueName: string, message: any, persistente = true) {
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: persistente,
    });
  }

  async sendMessageWithDelay(
    queueName: string,
    message: any,
    delay: number,
    persistent = true
  ) {
    this.channel.publish(
      'delay-exchange',
      queueName,
      Buffer.from(JSON.stringify(message)),
      {
        headers: { 'x-delay': delay },
        persistent,
      }
    );
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

  async CreatConsumer(
    queue: string,
    handle: IWorkerController,
    baseDelay = 5000,
    maxDelay = 5 * 60 * 1000,
    prefetch = 100
  ) {
    const connection = await this.getConnection();
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });
    const exchange = 'delay-exchange';
    await channel.assertExchange(exchange, 'x-delayed-message', {
      autoDelete: false,
      durable: true,
      arguments: { 'x-delayed-type': 'direct' },
    });
    channel.bindQueue(queue, exchange, queue);
    console.log(`Starting ${queue}`);
    await channel.prefetch(prefetch);
    channel.consume(
      queue,
      async (message) => {
        if (message) {
          try {
            const response = await (() => {
              console.log(
                JSON.stringify({
                  queue,
                  payload: JSON.parse(message.content.toString()),
                })
              );
              return handle.handle(JSON.parse(message.content.toString()));
            })();
            channel.ack(message);
            console.log(response);
          } catch (error) {
            const retry = message.properties?.headers?.['x-retry']
              ? message.properties.headers['x-retry'] + 1
              : 1;
            const delay =
              baseDelay * retry <= maxDelay ? baseDelay * retry : maxDelay;
            if (retry >= 40) {
              // call THE PAPA
              console.log(error.message);
            } else {
              channel.publish(exchange, queue, message.content, {
                headers: { 'x-delay': delay, 'x-retry': retry },
              });
            }
            channel.ack(message);
            console.log(
              JSON.stringify({
                error: error.message,
                queue,
                payload: JSON.parse(message.content.toString()),
              })
            );
          }
        }
      },
      {}
    );
  }
}

export default new Queue();
