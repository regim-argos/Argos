/* eslint-disable no-console */
import axios from 'axios';
import Logger from '../../lib/Logger';
import WatcherData from '../data/WatcherData';

const ArgosApi = axios.create({
  baseURL: `${process.env.API_URL}/v1/pvt/`,
  headers: {
    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
  },
});

const timingAxios = axios.create();
timingAxios.interceptors.request.use((config) => {
  config.requestStartTime = Date.now();
  return config;
});
timingAxios.interceptors.response.use(
  (response) => {
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

  async handle({ data }) {
    const { id, user_id } = data;
    const watcher = await WatcherData.getById(id, user_id);

    let status;
    let responseTime;
    try {
      const responseAPI = await timingAxios.get(watcher.url);
      status = true;
      responseTime = responseAPI.config.requestTime;
    } catch (error) {
      status = false;
      responseTime = error.requestTime;
    }
    if (watcher.status !== status) {
      const newWatcher = await WatcherData.updateById(
        { lastChange: new Date(), status },
        id,
        user_id
      );
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
