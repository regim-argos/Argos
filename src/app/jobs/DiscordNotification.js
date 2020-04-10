/* eslint-disable no-console */
import axios from 'axios';
import getDataFormat from '../utils/getDataFormat';

class DiscordNotification {
  get key() {
    return 'DISCORD_NOTIFICATION';
  }

  async handle({ data }) {
    const { watcher, oldWatcher, notification } = data;
    const status = watcher.status ? 'UP' : 'DOWN';
    const circle = watcher.status ? ':green_circle:' : ':red_circle:';
    console.log(watcher.lastChange, oldWatcher.lastChange);
    await axios.post(notification.platformData.webhook, {
      username: 'Argos',
      content: `${circle} ${getDataFormat(
        watcher.lastChange,
        oldWatcher.lastChange,
        watcher.name,
        watcher.url,
        status
      )}`,
    });
  }
}

export default new DiscordNotification();
