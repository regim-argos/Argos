import Hash from './models/Hash';

class HashData {
  protected model = Hash;

  async getHashByHash(hash: string, type: string) {
    return this.model.getHashByHash(hash, type);
  }

  async createHash(data: Partial<Hash>, user_id: number) {
    return this.model.createHash(data, user_id);
  }

  async deleteHashById(id: number) {
    return this.model.deleteHashById(id);
  }
}

export default new HashData();
