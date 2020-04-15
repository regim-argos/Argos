import Bull from 'bull';
import { setQueues } from 'bull-board';
import ConfirmEmailJob from '../app/jobs/ConfirmEmail';
import redisConfig from '../config/redis';
import ForgetPassword from '../app/jobs/ForgetPassword';
import Watcher from '../app/jobs/Watcher';
import DiscordNotification from '../app/jobs/DiscordNotification';
import SlackNotification from '../app/jobs/SlackNotification';
import Logger from './Logger';

const jobs = [
  ConfirmEmailJob,
  ForgetPassword,
  Watcher,
  DiscordNotification,
  SlackNotification,
];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bull: new Bull(key, {
          limiter: {
            max: 12,
            duration: 4000,
          },
          defaultJobOptions: {
            backoff: 1 * 60 * 1000,
            attempts: 30,
            removeOnComplete: true,
          },
          redis: process.env.URL_REDIS || redisConfig,
        }),
        handle,
      };
    });
    setQueues(Object.keys(this.queues).map((key) => this.queues[key].bull));
  }

  add(queue, job) {
    return this.queues[queue].bull.add(job);
  }

  addRepeatJob(queue, job, repeat) {
    return this.queues[queue].bull.add(job, {
      repeat,
      jobId: job.id,
      attempts: 0,
      removeOnFail: true,
    });
  }

  async remove(queue, time, jobId) {
    await this.queues[queue].bull.removeRepeatable({ every: time, jobId });
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bull, handle } = this.queues[job.key];

      bull
        .on('error', this.handleFailure)
        .on('failed', this.handleFailure)
        .on('completed', this.handleSuccess)
        .process(handle);
    });
  }

  handleFailure(job, err) {
    // eslint-disable-next-line no-console
    Logger.error('WatcherError', err);
  }

  async handleSuccess() {
    // eslint-disable-next-line no-console
  }
}

export default new Queue();
