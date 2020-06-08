import BadRequestError from '../Error/BadRequestError';
import { MemberRole } from '../data/models/ProjectMember';
import ProjectData from '../data/ProjectData';
import ProjectValidator from '../Validators/ProjectValidator';
import Project from '../data/models/Project';
import UserServices from './UserServices';

class ProjectService {
  protected model = ProjectData;

  async getUserProjects(userId: number) {
    const project = await this.model.getUserProjects(userId);
    return project;
  }

  async create(data: Partial<Project>, userId: number) {
    const ValidatedProject = await ProjectValidator.createValidator<Project>(
      data
    );

    const HasOwnProject = await UserServices.verifyHasOwnProject(userId);

    if (HasOwnProject) {
      throw new BadRequestError('A user can create only one project');
    }

    const project = await this.model.createOne({
      ...ValidatedProject,
      members: [{ userId, role: MemberRole.OWNER }],
    });

    return project;
  }

  async verifyIsProjectMember(userId: number, projectId: number) {
    const project = await this.model.verifyIsProjectMember(userId, projectId);
    if (!project) throw new BadRequestError("User isn't member this project");
    return project;
  }
}

export default new ProjectService();
