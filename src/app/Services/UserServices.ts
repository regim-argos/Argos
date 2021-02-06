import jwt from 'jsonwebtoken';
import ValidateDecorator from '@app/utils/ValidateDecorator';
import Rabbit from '@lib/Rabbit';
import UserData from '../data/UserData';
import HashService from './HashService';
import UserValidator from '../Validators/UserValidator';
import NotFoundError from '../Error/NotFoundError';
import BadRequestError from '../Error/BadRequestError';
import FileService from './FileService';
import User from '../data/models/User';
import ProjectService from './ProjectService';
import authConfig from '../../config/auth';

class UserServices {
  protected model = UserData;

  protected validator = UserValidator;

  async confirmEmail(hash: string) {
    const hashDb = await HashService.verifyAndGetHash(hash, 'CONFIRM_EMAIL');
    await this.model.updateOne({ active: true }, hashDb.user_id);
    await HashService.delete(hashDb.user_id, 'CONFIRM_EMAIL');
  }

  @ValidateDecorator(1, 'updatePassword')
  async forgetPassword(hash: string, data: Partial<User>) {
    const { password } = data;
    const hashDb = await HashService.verifyAndGetHash(hash, 'CHANGE_PASSWORD');

    await this.model.updateOne({ password }, hashDb.user_id);
    await HashService.delete(hashDb.user_id, 'CHANGE_PASSWORD');
  }

  async verifyAndGetUserByEmail(email: string) {
    const user = await this.model.getUserByEmail(email);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async verifyAndGetUserByEmailWithoutError(email: string) {
    const user = await this.model.getUserByEmail(email);
    return user;
  }

  async verifyAndGetUserById(id: number) {
    const user = await this.model.getUserById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async verifyIfUniqueEmail(email: string) {
    const user = await this.model.getUserByEmail(email);
    if (user) throw new BadRequestError('User already exists');
    return user;
  }

  async createForgetPasswordHash(email: string) {
    if (!email) throw new BadRequestError('Email is required');
    const { id, name, active } = await this.verifyAndGetUserByEmail(email);
    if (!active) throw new BadRequestError('Email need confirmed');

    const { hash } = await HashService.create(id, 'CHANGE_PASSWORD');
    await Rabbit.sendMessage('forget-password', { name, email, hash }, true);
  }

  async createConfirmEmailHash(email: string, user?: User) {
    if (!email) throw new BadRequestError('Email is required');
    const { id, name, active } =
      user || (await this.verifyAndGetUserByEmail(email));
    if (active) throw new BadRequestError('Email already confirmed');
    const { hash } = await HashService.create(id);

    await Rabbit.sendMessage('confirm-email', { name, email, hash }, true);
  }

  @ValidateDecorator(0, 'createValidator')
  async create(data: User) {
    await this.verifyIfUniqueEmail(data.email);

    const user = await this.model.createOne(data);

    await this.createConfirmEmailHash(user.email, user);

    await ProjectService.setNewUserInProjectByEmail(user.id, user.email);

    return user;
  }

  @ValidateDecorator(0, 'updateValidator')
  async update(data: UserUpdate, userId: number) {
    const { oldPassword } = data;

    const user = await this.verifyAndGetUserById(userId);
    if (data.imageId) await FileService.verifyAndGetFile(data.imageId, userId);

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      throw new BadRequestError('Password does not match');
    }

    await this.model.updateOne(data, userId);

    const userSaved = await this.verifyAndGetUserById(userId);

    return userSaved;
  }

  async verifyHasOwnProject(userId: number) {
    const user = await this.model.verifyHasOwnProject(userId);
    if (user) {
      return true;
    }
    return false;
  }

  @ValidateDecorator(0, 'sessionValidator')
  async session(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await this.verifyAndGetUserByEmailWithoutError(email);

    if (!user) throw new BadRequestError('Invalid credentials');

    if (!(await user.checkPassword(password))) {
      throw new BadRequestError('Invalid credentials');
    }

    const { id, name, image } = user;

    return {
      user: { id, name, email, image },
      token: jwt.sign({ id }, authConfig.secret as string, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  }
}

interface UserUpdate extends User {
  oldPassword?: string;
}

export default new UserServices();
