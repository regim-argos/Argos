import Redis from '../../../lib/Redis';

class Cache {
  get keyPrefix() {
    throw new Error('need overwrite KeyPrefix');
  }

  get Redis() {
    return Redis;
  }

  getKey(userId) {
    return `${userId}:${this.keyPrefix}`;
  }

  invalidatesCreateKeys(userId) {
    return [{ key: `${this.getKey(userId)}:all`, type: 'ONE' }];
  }

  invalidateUpdateKeys(userId, id) {
    return [
      { key: `${this.getKey(userId)}:all`, type: 'ONE' },
      { key: `${this.getKey(userId)}:${id}`, type: 'ONE' },
    ];
  }

  async getCache(userId, key) {
    return Redis.get(`${this.getKey(userId)}:${key}`);
  }

  async setCache(userId, key, data) {
    await Redis.set(`${this.getKey(userId)}:${key}`, data);
  }

  async invalidateCreate(userId) {
    return this.invalidation(this.invalidatesCreateKeys(userId));
  }

  async invalidateUpdate(userId, id) {
    return this.invalidation(this.invalidateUpdateKeys(userId, id));
  }

  async invalidation(invalidateKeyArray) {
    return Promise.all(
      invalidateKeyArray.map(async ({ key, type }) => {
        if (type === 'MANY') {
          await Redis.invalidatePrefix(key);
        } else {
          await Redis.invalidate(key);
        }
      })
    );
  }
}

export default Cache;
