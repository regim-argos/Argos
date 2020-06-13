import Redis from '../../../lib/Redis';

class Cache {
  protected keyPrefix!: string;

  get Redis() {
    return Redis;
  }

  getKey(projectId: number) {
    return `${projectId}:${this.keyPrefix}`;
  }

  invalidatesCreateKeys(projectId: number) {
    return [{ key: `${this.getKey(projectId)}:all`, type: 'ONE' }];
  }

  invalidateUpdateKeys(projectId: number, id: number) {
    return [
      { key: `${this.getKey(projectId)}:all`, type: 'ONE' },
      { key: `${this.getKey(projectId)}:${id}`, type: 'ONE' },
    ];
  }

  async getCache(projectId: number, key: string | number) {
    return Redis.get(`${this.getKey(projectId)}:${key}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setCache(projectId: number, key: string | number, data: any) {
    await Redis.set(`${this.getKey(projectId)}:${key}`, data);
  }

  async invalidateCreate(projectId: number) {
    return this.invalidation(this.invalidatesCreateKeys(projectId));
  }

  async invalidateUpdate(projectId: number, id: number) {
    return this.invalidation(this.invalidateUpdateKeys(projectId, id));
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
