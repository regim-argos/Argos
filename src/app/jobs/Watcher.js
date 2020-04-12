/* eslint-disable no-console */
import axios from 'axios';
import Cache from '../../lib/Redis';

const ArgosApi = axios.create({
  baseURL: `${process.env.API_URL}/v1/pvt/`,
  headers: {
    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
  },
});

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
    try {
      await axios.get(watcher.url);
      if (!watcher.status)
        await ArgosApi.put(`change_status/${id}`, { status: true });
    } catch (error) {
      if (watcher.status)
        await ArgosApi.put(`change_status/${id}`, { status: false });
    }
  }
}

export default new Watcher();
