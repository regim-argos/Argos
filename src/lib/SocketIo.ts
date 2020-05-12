import io from 'socket.io';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import http from 'http';

import authConfig from '../config/auth';
import Redis from './Redis';

export default class SocketIo {
  protected io: io.Server;

  constructor(server: http.Server) {
    this.io = io(server);
    this.io.on('connection', this.onConnection);
  }

  async onConnection(socket: io.Socket) {
    const { token } = socket.handshake.query;
    try {
      const { id } = (await promisify(jwt.verify)(
        token,
        authConfig.secret as string
      )) as { id: number };
      Redis.set(`token:${id}`, socket.id);

      socket.on('disconnect', async () => {
        await Redis.invalidate(`token:${id}`);
      });
    } catch (err) {
      socket.disconnect(true);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendNotification(userId: number, event: string, data: any) {
    const cached = await Redis.get(`token:${userId}`);
    this.io.to(cached).emit(event, data);
  }
}
