/* eslint-disable no-console */
import axios from 'axios';
import Cache from '../../lib/Redis';
import Logger from '../../lib/Logger';

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
    const { id } = data;
    let watcher;
    watcher = await Cache.get(`admin:watchers:${id}`);
    if (!watcher) {
      const response = await ArgosApi.get(`watchers/${id}`);
      watcher = response.data;
    }
    let status;
    let responseTime;
    try {
      const responseAPI = await timingAxios.get(watcher.url);
      status = true;
      responseTime = responseAPI.config.requestTime;
    } catch (error) {
      status = true;
      responseTime = error.requestTime;
    }
    if (watcher.status !== status)
      await ArgosApi.put(`change_status/${id}`, { status });
    Logger.info('Watcher', {
      id: watcher.id,
      requestDate: new Date(),
      status,
      responseTime,
    });
  }
}

export default new Watcher();
