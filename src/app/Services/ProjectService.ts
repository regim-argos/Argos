import ValidateDecorator from '@app/utils/ValidateDecorator';
import Rabbit from '@lib/Rabbit';
import BadRequestError from '../Error/BadRequestError';
import { MemberRole } from '../data/models/ProjectMember';
import ProjectData from '../data/ProjectData';
import ProjectValidator from '../Validators/ProjectValidator';
import Project from '../data/models/Project';
import UserServices from './UserServices';

class ProjectService {
  protected model = ProjectData;

  protected validator = ProjectValidator;

  async getUserProjects(userId: number) {
    const project = await this.model.getUserProjects(userId);
    return project;
  }

  async verifyAndGet(userId: number, projectId: number) {
    await this.verifyIsProjectMember(userId, projectId);
    return this.model.getById(projectId);
  }

  @ValidateDecorator(0, 'createValidator')
  async create(data: Partial<Project>, userId: number) {
    const HasOwnProject = await UserServices.verifyHasOwnProject(userId);

    const { email } = await UserServices.verifyAndGetUserById(userId);

    if (HasOwnProject) {
      throw new BadRequestError('A user can create only one project');
    }

    const project = await this.model.createOne(
      {
        ...data,
        members: [{ userId, role: MemberRole.OWNER, email }],
      },
      userId
    );

    return project;
  }

  async verifyIsProjectMember(userId: number, projectId: number) {
    const project = await this.model.verifyIsProjectMember(userId, projectId);
    if (!project) throw new BadRequestError("User isn't a project member");
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
    if (!project) throw new BadRequestError("User isn't a project member");
    if (project.members[0].role !== 'OWNER')
      throw new BadRequestError("User isn't a project owner");
    return project;
  }

  @ValidateDecorator(0, 'addMember')
  async addMember(data: { email: string }, userId: number, projectId: number) {
    const { email } = data;

    const projectOwner = await this.verifyIsOwnerMember(userId, projectId);

    await this.verifyIsProjectMemberByEmail(email, projectId);

    const userToAdd = await UserServices.verifyAndGetUserByEmailWithoutError(
      email
    );

    const project = await this.model.addMember(userToAdd?.id, email, projectId);

    if (!userToAdd?.id) {
      await Rabbit.sendMessage(
        'new-member',
        {
          name: projectOwner.members[0].user?.name,
          email,
          projectName: project.name,
        },
        true
      );
    }

    return project;
  }

  @ValidateDecorator(0, 'addMember')
  async removeMember(
    data: { email: string },
    userId: number,
    projectId: number
  ) {
    const { email } = data;

    await this.verifyIsOwnerMember(userId, projectId);

    const projectOwner = await this.model.verifyIsProjectMemberByEmail(
      email,
      projectId
    );

    if (!projectOwner) throw new BadRequestError("User isn't a project member");

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
