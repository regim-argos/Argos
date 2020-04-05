/* eslint-disable no-console */
import axios from 'axios';

class DiscordNotification {
  get key() {
    return 'DISCORD_NOTIFICATION';
  }

  async handle({ data }) {
    const { watcher, notification } = data;
    await axios.post(notification.platformData.webhook, {
      username: 'Argos',
      content: `${watcher.name}(${watcher.url}) is ${
        watcher.status ? 'UP' : 'DOWN'
      }`,
    });
  }
}

export default new DiscordNotification();
