import io from 'socket.io';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';
import Redis from './Redis';

export default class SocketIo {
  constructor(server) {
    this.io = io(server);

    this.io.on('connection', this.onConnection);
  }

  async onConnection(socket) {
    const { token } = socket.handshake.query;
    try {
      const { id } = await promisify(jwt.verify)(token, authConfig.secret);
      Redis.set(`token:${id}`, socket.id);

      socket.on('disconnect', async () => {
        await Redis.invalidate(`token:${id}`);
      });
    } catch (err) {
      socket.disconnect(true);
    }
  }

  async sendNotification(userId, event, data) {
    const cached = await Redis.get(`token:${userId}`);
    this.io.to(cached).emit(event, data);
  }
}
