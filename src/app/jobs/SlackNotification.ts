/* eslint-disable no-console */
import axios from 'axios';
import getDataFormat from '../utils/getDataFormat';
import WatcherToNotification from '../utils/IWatcherToNotification';
import Notification from '../data/models/Notification';

interface SlackData {
  data: {
    watcher: WatcherToNotification;
    notification: Notification;
  };
}
class SlackNotification {
  get key() {
    return 'SLACK_NOTIFICATION';
  }

  async handle({ data }: SlackData) {
    const { watcher, notification } = data;
    const status = watcher.status ? 'UP' : 'DOWN';
    const circle = watcher.status ? ':heavy_check_mark:' : ':red_circle:';

    await axios.post(notification.platformData.webhook, {
      text: `${circle} ${getDataFormat(
        watcher.lastChange,
        watcher.oldLastChange,
        watcher.name,
        watcher.url,
        status
      )}`,
    });
  }
}

export default new SlackNotification();
