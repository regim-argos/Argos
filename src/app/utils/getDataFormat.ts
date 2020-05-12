import { parseISO, differenceInSeconds } from 'date-fns';

export default function getDataFormat(
  newDateISO: string,
  oldDateISO: string,
  name: string,
  url: string,
  status: 'DOWN' | 'UP'
) {
  const newDate = parseISO(newDateISO);
  const newOld = parseISO(oldDateISO);
  const secondsDifference = differenceInSeconds(newDate, newOld);
  const lastStatus = status === 'DOWN' ? 'up' : 'down';

  const timers: { type: string; value: number }[] = [
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
    { value: [], time: secondsDifference } as { value: string[]; time: number }
  );

  const date = a.value.reduce((acc, timer, i) => {
    if (i === 0) {
      return `${timer}`;
    }
    return `${acc}${i !== a.value.length - 1 ? ',' : ' and '} ${timer}`;
  }, '');

  return `${name}(${url}) is ${status} now\nIt was ${lastStatus} for ${date}`;
}
