/* eslint-disable no-console */
import axios from 'axios';
import Logger from '../../lib/Logger';
import WatcherData from '../data/WatcherData';
import WatcherModel from '../data/models/Watcher';
import Event from '../data/models/Event';

interface WatcherMsgData {
  data: WatcherModel;
}

const ArgosApi = axios.create({
  baseURL: `${process.env.API_URL}/v1/pvt/`,
  headers: {
    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
  },
});

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
    const { id, user_id } = data;
    const watcher = await WatcherData.getById(id, user_id);

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
      const newWatcher = await WatcherData.updateById(
        { lastChange: lastChange.toISOString(), status },
        id,
        user_id
      );
      await Event.createOne(newWatcher.id, status, lastChange);
      await ArgosApi.put(`change_status/${id}`, {
        ...newWatcher,
        oldLastChange: watcher.lastChange,
      });
    }
    Logger.info('Watcher', {
      id: watcher.id,
      requestDate: new Date(),
      status,
      responseTime,
    });
  }
}

export default new Watcher();
