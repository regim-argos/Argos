import './bootstrap';
import './tracer';

import Youch from 'youch';
import path from 'path';
import express from 'express';
import connect_datadog from 'connect-datadog';
import 'express-async-errors';
import cors from 'cors';
import http from 'http';

import * as Sentry from '@sentry/node';
import routesV1 from './app/routes';
import db from './database';
import sentryConfig from './config/sentry';
import SocketIo from './lib/SocketIo';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    if (process.env.NODE_ENV === 'production') Sentry.init(sentryConfig);

    this.socket();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  socket() {
    this.socketIo = new SocketIo(this.server);
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    if (process.env.NODE_ENV === 'production')
      this.app.use(connect_datadog({ response_code: true }));
    this.app.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.app.use((req, res, next) => {
      req.io = this.socketIo;

      next();
    });
  }

  routes() {
    this.app.use(routesV1);
    this.app.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      if (err.name === 'ArgosValidationError') {
        return res.status(err.status).json(err.body);
      }
      if (err.name === 'MulterError') {
        const { message } = err;
        const error = {
          status: 'error',
          message,
        };
        return res.status(400).json(error);
      }
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }

  close() {
    db.close();
  }
}

export default new App();
