import Bull from 'bull';
import { setQueues } from 'bull-board';
import ConfirmEmailJob from '../app/jobs/ConfirmEmail';
import redisConfig from '../config/redis';
import ForgetPassword from '../app/jobs/ForgetPassword';

const jobs = [ConfirmEmailJob, ForgetPassword];

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
            duration: 1000,
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
    setQueues(Object.keys(this.queues).map(key => this.queues[key].bull));
  }

  add(queue, job) {
    return this.queues[queue].bull.add(job);
  }

  processQueue() {
    jobs.forEach(job => {
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

  handleSuccess(job, err) {
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name}: SUCCESS`, err);
  }
}

export default new Queue();
