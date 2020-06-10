import UserData from '../data/UserData';
import HashService from './HashService';
import UserValidator from '../Validators/UserValidator';
import Queue from '../../lib/Queue';
import ConfirmEmail from '../jobs/ConfirmEmail';
import ForgetPassword from '../jobs/ForgetPassword';
import NotFoundError from '../Error/NotFoundError';
import BadRequestError from '../Error/BadRequestError';
import FileService from './FileService';
import User from '../data/models/User';

class UserServices {
  protected model = UserData;

  async confirmEmail(hash: string) {
    const hashDb = await HashService.verifyAndGetHash(hash, 'CONFIRM_EMAIL');
    await this.model.updateOne({ active: true }, hashDb.user_id);
    await HashService.delete(hashDb.id);
  }

  async forgetPassword(hash: string, data: Partial<User>) {
    const { password } = await UserValidator.updatePassword(data);
    const hashDb = await HashService.verifyAndGetHash(hash, 'CHANGE_PASSWORD');

    await this.model.updateOne({ password }, hashDb.user_id);
    await HashService.delete(hashDb.id);
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
    await Queue.add(ForgetPassword.key, { name, email, hash });
  }

  async createConfirmEmailHash(email: string, user?: User) {
    const { id, name, active } =
      user || (await this.verifyAndGetUserByEmail(email));
    if (active) throw new BadRequestError('Email already confirmed');
    const { hash } = await HashService.create(id);

    await Queue.add(ConfirmEmail.key, { name, email, hash });
  }

  async create(data: Partial<User>) {
    const ValidatedUser = await UserValidator.createValidator<User>(data);

    await this.verifyIfUniqueEmail(ValidatedUser.email);

    const user = await this.model.createOne(ValidatedUser);

    await this.createConfirmEmailHash(user.email, user);

    return user;
  }

  async update(data: Partial<User>, userId: number) {
    const ValidatedUser = await UserValidator.updateValidator<UserUpdate>(data);

    const { oldPassword } = ValidatedUser;

    const user = await this.verifyAndGetUserById(userId);
    if (ValidatedUser.imageId)
      await FileService.verifyAndGetFile(ValidatedUser.imageId, userId);

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      throw new BadRequestError('Password does not match');
    }

    await this.model.updateOne(ValidatedUser, userId);

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
}

interface UserUpdate extends User {
  oldPassword?: string;
}

export default new UserServices();
