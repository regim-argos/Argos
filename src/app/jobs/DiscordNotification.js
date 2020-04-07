/* eslint-disable no-console */
import axios from 'axios';
import { parseISO, differenceInSeconds } from 'date-fns';

function getDate(newDateISO, oldDateISO, name, url, status) {
  const newDate = parseISO(newDateISO);
  const newOld = parseISO(oldDateISO);
  const secondsDifference = differenceInSeconds(newDate, newOld);
  const lastStatus = !status ? 'up' : 'down';

  const timers = [
    { type: 'years', value: 60 * 60 * 24 * 365 },
    { type: 'months', value: 60 * 60 * 24 * 30 },
    { type: 'days', value: 60 * 60 * 24 },
    { type: 'hours', value: 60 * 60 },
    { type: 'minutes', value: 60 },
    { type: 'seconds', value: 1 },
  ];

  const a = timers.reduce(
    (acc, timer) => {
      const value = Math.floor(acc.time / timer.value);
      acc.time %= timer.value;
      if (value > 0) {
        acc.value.push(`${value} ${timer.type}`);
      }
      return acc;
    },
    { value: [], time: secondsDifference }
  );

  const date = a.value.reduce((acc, timer, i) => {
    if (i === 0) {
      return `${timer}`;
    }
    return `${acc}${i !== a.value.length - 1 ? ',' : ' and '} ${timer}`;
  }, '');

  return `${name}(${url}) is ${status} now\nIt was ${lastStatus} for ${date}`;
}
class DiscordNotification {
  get key() {
    return 'DISCORD_NOTIFICATION';
  }

  async handle({ data }) {
    const { watcher, oldWatcher, notification } = data;
    const status = watcher.status ? 'UP' : 'DOWN';
    const circle = watcher.status ? ':green_circle:' : ':red_circle:';

    await axios.post(notification.platformData.webhook, {
      username: 'Argos',
      content: `${circle} ${getDate(
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
