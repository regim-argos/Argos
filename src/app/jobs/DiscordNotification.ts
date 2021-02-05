/* eslint-disable no-console */
import axios from 'axios';
import getDataFormat from '../utils/getDataFormat';
import Notification from '../data/models/Notification';
import WatcherToNotification from '../utils/IWatcherToNotification';
import { IWorkerController } from './IWorkerController';

interface DiscordData {
  watcher: WatcherToNotification;
  notification: Notification;
}
class DiscordNotification implements IWorkerController {
  get key() {
    return 'DISCORD_NOTIFICATION';
  }

  async handle(data: DiscordData) {
    const { watcher, notification } = data;
    const status = watcher.status ? 'UP' : 'DOWN';
    const circle = watcher.status ? ':green_circle:' : ':red_circle:';
    console.log(watcher.lastChange, watcher.oldLastChange);
    await axios.post(notification.platformData.webhook, {
      username: 'Argos',
      content: `${circle} ${getDataFormat(
        watcher.lastChange,
        watcher.oldLastChange,
        watcher.name,
        watcher.url,
        status
      )}`,
    });
  }
}

export default new DiscordNotification();
