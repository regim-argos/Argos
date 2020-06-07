import ProjectData from '../data/ProjectData';
import ProjectValidator from '../Validators/ProjectValidator';
import Project from '../data/models/Project';

class ProjectServices {
  protected model = ProjectData;

  async create(data: Partial<Project>) {
    const ValidatedProject = await ProjectValidator.createValidator<Project>(
      data
    );
    const project = await this.model.createOne(ValidatedProject);

    return project;
  }
}

export default new ProjectServices();
