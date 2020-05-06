import winston from 'winston';
import DatadogWinston from 'datadog-winston';

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      exitOnError: false,
      format: winston.format.json(),
    });
    this.logger.add(
      new DatadogWinston({
        apiKey: process.env.API_DATADOG,
        hostname: 'argos',
        service: 'argos',
        ddsource: 'node.js',
      })
    );
  }

  info(type, data) {
    this.logger.info(type, data);
  }

  error(type, data) {
    this.logger.log('error', { data, level: 'error' });
  }
}

export default new Logger();
