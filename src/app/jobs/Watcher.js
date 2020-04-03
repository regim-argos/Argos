import axios from 'axios';

class Watcher {
  get key() {
    return 'Watcher';
  }

  async handle({ data }) {
    const { name, url, id } = data;
    try {
      await axios.get(url);
      console.log(name, id, 'UP');
    } catch (error) {
      console.log(name, id, 'DOWN');
    }
  }
}

export default new Watcher();
