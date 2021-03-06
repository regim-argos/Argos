/* eslint-disable @typescript-eslint/no-explicit-any */
import Bull from 'bull';
import { setQueues } from 'bull-board';
import NewMemberEmail from '@app/jobs/NewMemberEmail';
import ConfirmEmailJob from '../app/jobs/ConfirmEmail';
import redisConfig from '../config/redis';
import ForgetPassword from '../app/jobs/ForgetPassword';
import DiscordNotification from '../app/jobs/DiscordNotification';
import SlackNotification from '../app/jobs/SlackNotification';
import Logger from './Logger';

const jobs = [
  ConfirmEmailJob,
  ForgetPassword,
  DiscordNotification,
  SlackNotification,
  NewMemberEmail,
];

interface ArgosQueues {
  [x: string]: {
    bull: Bull.Queue;
    handle: (data: any) => void;
  };
}

class Queue {
  protected queues: ArgosQueues = {};

  constructor() {
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
          redis: (process.env.URL_REDIS as string) || redisConfig,
        }),
        handle,
      };
    });
    setQueues(Object.keys(this.queues).map((key) => this.queues[key].bull));
  }

  add(queue: string, job: any) {
    return this.queues[queue].bull.add(job);
  }

  addRepeatJob(
    queue: string,
    job: any,
    repeat: Bull.CronRepeatOptions | Bull.EveryRepeatOptions | undefined
  ) {
    return this.queues[queue].bull.add(job, {
      repeat,
      jobId: job.id,
      attempts: 0,
      removeOnFail: true,
    });
  }

  async remove(queue: string, time: number, jobId: number) {
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

  handleFailure(_: any, err: Error) {
    // eslint-disable-next-line no-console
    console.log(err);
    Logger.error('WatcherError', err);
  }

  async handleSuccess() {
    // eslint-disable-next-line no-console
  }
}

export default new Queue();
