import Bull from 'bull';
import { setQueues } from 'bull-board';
import ConfirmEmailJob from '../app/jobs/ConfirmEmail';
import redisConfig from '../config/redis';
import ForgetPassword from '../app/jobs/ForgetPassword';
import Watcher from '../app/jobs/Watcher';
import DiscordNotification from '../app/jobs/DiscordNotification';

const jobs = [ConfirmEmailJob, ForgetPassword, Watcher, DiscordNotification];

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
            backoff: 5 * 60 * 1000,
            attempts: 150,
            removeOnComplete: true,
          },
          redis: redisConfig,
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
    return this.queues[queue].bull.add(job, { repeat, jobId: job.id });
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
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }

  async handleSuccess(job, err) {
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name}: SUCCESS`, err);
  }
}

export default new Queue();
