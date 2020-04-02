import './bootstrap';
import './tracer';

import Youch from 'youch';
import path from 'path';
import express from 'express';
import connect_datadog from 'connect-datadog';
import 'express-async-errors';
import cors from 'cors';

import * as Sentry from '@sentry/node';
import routesV1 from './app/routes';
import db from './database';
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();

    if (process.env.NODE_ENV === 'production') Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    if (process.env.NODE_ENV === 'production')
      this.server.use(connect_datadog({ response_code: true }));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routesV1);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
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
