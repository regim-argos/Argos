import Redis from '../../../lib/Redis';

class Cache {
  protected keyPrefix!: string;

  get Redis() {
    return Redis;
  }

  getKey(userId: number) {
    return `${userId}:${this.keyPrefix}`;
  }

  invalidatesCreateKeys(userId: number) {
    return [{ key: `${this.getKey(userId)}:all`, type: 'ONE' }];
  }

  invalidateUpdateKeys(userId: number, id: number) {
    return [
      { key: `${this.getKey(userId)}:all`, type: 'ONE' },
      { key: `${this.getKey(userId)}:${id}`, type: 'ONE' },
    ];
  }

  async getCache(userId: number, key: string | number) {
    return Redis.get(`${this.getKey(userId)}:${key}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setCache(userId: number, key: string | number, data: any) {
    await Redis.set(`${this.getKey(userId)}:${key}`, data);
  }

  async invalidateCreate(userId: number) {
    return this.invalidation(this.invalidatesCreateKeys(userId));
  }

  async invalidateUpdate(userId: number, id: number) {
    return this.invalidation(this.invalidateUpdateKeys(userId, id));
  }

  async invalidation(
    invalidateKeyArray: { key: string | number; type: string }[]
  ) {
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
