class Data {
  constructor(model, cache) {
    this.model = model;
    this.cache = cache;
  }

  async getAllByUserId(userId) {
    let value = await this.cache?.getCache(userId, 'all');

    if (value) return value;

    value = await this.model.getAllByUserId(userId);

    await this.cache?.setCache(userId, 'all', value);

    return value;
  }

  async getById(id, userId) {
    let value = await this.cache?.getCache(userId, id);

    if (value) return value;

    value = await this.model.getById(id, userId);

    await this.cache?.setCache(userId, id, value);

    return value;
  }

  async create(data, userId) {
    const value = await this.model.create(data, userId);
    await this.cache?.invalidateCreate(userId);
    return value;
  }

  async updateById(data, id, userId) {
    const value = await this.model.updateById(data, id, userId);
    await this.cache?.invalidateUpdate(userId, id);
    return value;
  }

  async deleteById(id, userId) {
    const value = await this.model.deleteById(id, userId);
    await this.cache?.invalidateUpdate(userId, id);
    return value;
  }
}

export default Data;
