/* eslint-disable no-console */
import axios from 'axios';
import WatcherToNotification from '@app/utils/IWatcherToNotification';
import Rabbit from '@lib/Rabbit';
import Logger from '../../lib/Logger';
import WatcherData from '../data/WatcherData';
import WatcherModel from '../data/models/Watcher';
import Event from '../data/models/Event';
import { IWorkerController } from './IWorkerController';

const timingAxios = axios.create();
timingAxios.interceptors.request.use((config) => {
  // @ts-ignore
  config.requestStartTime = Date.now();
  return config;
});
timingAxios.interceptors.response.use(
  (response) => {
    // @ts-ignore
    response.config.requestTime = Date.now() - response.config.requestStartTime;
    return response;
  },
  (error) => {
    error.requestTime = Date.now() - error.config.requestStartTime;
    return Promise.reject(error);
  }
);

class Watcher implements IWorkerController {
  get key() {
    return 'Watcher';
  }

  async handle(data: WatcherModel) {
    const { id, projectId } = data;
    const watcher = await WatcherData.getById(id, projectId);
    if (!watcher) return;
    console.log(
      watcher.currentWatcherId,
      data.currentWatcherId,
      watcher.currentWatcherId !== data.currentWatcherId
    );
    if (watcher.currentWatcherId !== data.currentWatcherId) return;

    let status;
    let responseTime;
    try {
      const responseAPI = await timingAxios.get(watcher.url);
      status = true;
      // @ts-ignore
      responseTime = responseAPI.config.requestTime;
    } catch (error) {
      status = false;
      responseTime = error.requestTime;
    }
    if (watcher.status !== status) {
      const lastChange = new Date();
      const newWatcher = (await WatcherData.updateById(
        { lastChange: lastChange.toISOString(), status },
        id,
        projectId
      )) as WatcherToNotification;
      await Event.createOne(newWatcher.id, status, lastChange);
      newWatcher.oldLastChange = watcher.lastChange;
      // await WatcherService.changeStatusNotifications(newWatcher);
    }
    Rabbit.sendMessageWithDelay('watcher', data, watcher.delay * 1000, true);
    Logger.info('Watcher', {
      id: watcher.id,
      requestDate: new Date(),
      status,
      responseTime,
    });
  }
}

export default new Watcher();
