/* eslint-disable no-console */
import axios from 'axios';
import getDataFormat from '../utils/getDataFormat';

class SlackNotification {
  get key() {
    return 'SLACK_NOTIFICATION';
  }

  async handle({ data }) {
    const { watcher, oldWatcher, notification } = data;
    const status = watcher.status ? 'UP' : 'DOWN';
    const circle = watcher.status ? ':heavy_check_mark:' : ':red_circle:';

    await axios.post(notification.platformData.webhook, {
      text: `${circle} ${getDataFormat(
        watcher.lastChange,
        oldWatcher.lastChange,
        watcher.name,
        watcher.url,
        status
      )}`,
    });
  }
}

export default new SlackNotification();
