import Queue from '@lib/Queue';
import NewMemberEmail from '@app/jobs/NewMemberEmail';
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

  async verifyAndGet(userId: number, projectId: number) {
    await this.verifyIsOwnerMember(userId, projectId);
    return this.model.getById(projectId);
  }

  // TODO user email
  async create(data: Partial<Project>, userId: number) {
    const ValidatedProject = await ProjectValidator.createValidator<Project>(
      data
    );

    const HasOwnProject = await UserServices.verifyHasOwnProject(userId);

    const { email } = await UserServices.verifyAndGetUserById(userId);

    if (HasOwnProject) {
      throw new BadRequestError('A user can create only one project');
    }

    const project = await this.model.createOne({
      ...ValidatedProject,
      members: [{ userId, role: MemberRole.OWNER, email }],
    });

    return project;
  }

  async verifyIsProjectMember(userId: number, projectId: number) {
    const project = await this.model.verifyIsProjectMember(userId, projectId);
    if (!project) throw new BadRequestError("User isn't  a project member");
    return project;
  }

  async verifyIsProjectMemberByEmail(email: string, projectId: number) {
    const isMember = await this.model.verifyIsProjectMemberByEmail(
      email,
      projectId
    );
    if (isMember) throw new BadRequestError('User is already a project member');
    return isMember;
  }

  async verifyIsOwnerMember(userId: number, projectId: number) {
    const project = await this.model.verifyIsProjectMember(userId, projectId);
    if (!project) throw new BadRequestError("User isn't project member");
    if (project.members[0].role !== 'OWNER')
      throw new BadRequestError("user isn't project owner");
    return project;
  }

  async addMember(data: { email: string }, userId: number, projectId: number) {
    const ValidatedProject = await ProjectValidator.addMember<{
      email: string;
    }>(data);
    const { email } = ValidatedProject;

    const projectOwner = await this.verifyIsOwnerMember(userId, projectId);

    await this.verifyIsProjectMemberByEmail(ValidatedProject.email, projectId);

    const userToAdd = await UserServices.verifyAndGetUserByEmailWithoutError(
      ValidatedProject.email
    );

    const project = await this.model.addMember(userToAdd?.id, email, projectId);

    if (!userToAdd?.id) {
      await Queue.add(NewMemberEmail.key, {
        name: projectOwner.members[0].user?.name,
        email,
        projectName: project.name,
      });
    }

    return project;
  }

  async removeMember(
    data: { email: string },
    userId: number,
    projectId: number
  ) {
    const ValidatedProject = await ProjectValidator.addMember<{
      email: string;
    }>(data);
    const { email } = ValidatedProject;

    await this.verifyIsOwnerMember(userId, projectId);

    const projectOwner = await this.model.verifyIsProjectMemberByEmail(
      email,
      projectId
    );

    if (!projectOwner) throw new BadRequestError("User isn't project member");

    if (projectOwner.members[0].userId === userId)
      throw new BadRequestError("You can't remove yourself");

    const project = await this.model.removeMember(
      email,
      projectId,
      projectOwner.members[0].userId
    );

    return project;
  }

  async setNewUserInProjectByEmail(userId: number, email: string) {
    return this.model.setNewUserInProjectByEmail(userId, email);
  }
}

export default new ProjectService();
