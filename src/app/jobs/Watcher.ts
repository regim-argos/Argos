/* eslint-disable no-console */
import axios from 'axios';
import WatcherToNotification from '@app/utils/IWatcherToNotification';
import Logger from '../../lib/Logger';
import WatcherData from '../data/WatcherData';
import WatcherModel from '../data/models/Watcher';
import Event from '../data/models/Event';
import WatcherService from '../Services/WatcherService';

interface WatcherMsgData {
  data: WatcherModel;
}

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

class Watcher {
  get key() {
    return 'Watcher';
  }

  async handle({ data }: WatcherMsgData) {
    const {
      id,
      projectId,
      url,
      status: oldStatus,
      lastChange: oldLastChange,
    } = data;

    let status;
    let responseTime;
    try {
      const responseAPI = await timingAxios.get(url);
      status = true;
      // @ts-ignore
      responseTime = responseAPI.config.requestTime;
    } catch (error) {
      status = false;
      responseTime = error.requestTime;
    }
    if (oldStatus !== status) {
      const lastChange = new Date();
      const newWatcher = (await WatcherData.updateById(
        { lastChange: lastChange.toISOString(), status },
        id,
        projectId
      )) as WatcherToNotification;
      await Event.createOne(newWatcher.id, status, lastChange);
      newWatcher.oldLastChange = oldLastChange;
      await WatcherService.changeStatusNotifications(newWatcher);
    }
    Logger.info('Watcher', {
      id,
      requestDate: new Date(),
      status,
      responseTime,
    });
  }
}

export default new Watcher();
