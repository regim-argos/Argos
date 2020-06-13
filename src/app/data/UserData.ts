import User from './models/User';

class UserData {
  protected model = User;

  async getUserById(id: number) {
    return this.model.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return this.model.getUserByEmail(email);
  }

  async createOne(data: Partial<User>) {
    return this.model.createOne(data);
  }

  async updateOne(data: Partial<User>, id: number) {
    return this.model.updateOne(data, id);
  }

  async verifyHasOwnProject(id: number) {
    return this.model.verifyHasOwnProject(id);
  }
}

export default new UserData();
