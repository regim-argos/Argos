import Project from './models/Project';

class ProjectData {
  protected model = Project;

  async createOne(data: Partial<Project>) {
    return this.model.createOne(data);
  }

  async verifyIsProjectMember(userId: number, productId: number) {
    return this.model.verifyIsProjectMember(userId, productId);
  }
}

export default new ProjectData();
